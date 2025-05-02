import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import QuizResult from '@/components/quiz/QuizResult';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getQuestionLanguages, getQuestionsByLanguage } from '@/lib/api';

const formSchema = z.object({
  language: z.string().min(1, 'Please select a language'),
  questionCount: z.string().min(1, 'Please select the number of questions'),
});

type FormData = z.infer<typeof formSchema>;

const Quiz = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [language, setLanguage] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<string>('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [quizEndTime, setQuizEndTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);

  const fetchLanguages = async () => {
    try {
      const languages = await getQuestionLanguages();
      setLanguages(languages);
    } catch (error) {
      toast({
        title: t('quiz.error'),
        description: t('quiz.fetchLanguagesError'),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleQuestionCountChange = (value: string) => {
    setQuestionCount(value);
  };

  const fetchQuestions = async (language: string) => {
    try {
      setLoading(true);
      const questions = await getQuestionsByLanguage(language);
      return questions;
    } catch (error) {
      toast({
        title: t('quiz.error'),
        description: t('quiz.fetchError'),
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!language || !questionCount) {
      toast({
        title: "Error",
        description: t('quiz.chooseLanguage'),
        variant: "destructive",
      });
      return;
    }

    const fetchedQuestions = await fetchQuestions(language);
    
    if (fetchedQuestions.length === 0) {
      toast({
        title: t('quiz.noQuestions'),
        description: t('quiz.noQuestionsDesc', { language }),
        variant: "destructive",
      });
      return;
    }
    
    const shuffledQuestions = fetchedQuestions.sort(() => Math.random() - 0.5);
    const count = Math.min(parseInt(questionCount), shuffledQuestions.length);
    const selectedQuestions = shuffledQuestions.slice(0, count);
    
    if (selectedQuestions.length < parseInt(questionCount)) {
      toast({
        description: t('quiz.limitedQuestions', { count: selectedQuestions.length, language }),
      });
    }
    
    setQuizQuestions(selectedQuestions);
    setIsStarted(true);
    setQuizStartTime(new Date());
  };

  const handleAnswerSelect = (choiceIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [quizQuestions[currentQuestionIndex]._id]: choiceIndex,
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setIsFinished(true);
      setQuizEndTime(new Date());
    }
  };

  const restartQuiz = () => {
    setIsStarted(false);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizQuestions([]);
    setQuizStartTime(null);
    setQuizEndTime(null);
  };

  const calculateScore = () => {
    let correctCount = 0;
    
    quizQuestions.forEach((question) => {
      const selectedChoiceIndex = selectedAnswers[question._id];
      if (selectedChoiceIndex !== undefined && question.choices[selectedChoiceIndex].isCorrect) {
        correctCount++;
      }
    });
    
    return {
      correct: correctCount,
      total: quizQuestions.length,
      percentage: Math.round((correctCount / quizQuestions.length) * 100),
    };
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const selectedChoiceIndex = currentQuestion ? selectedAnswers[currentQuestion._id] : undefined;
  const isAnswerSelected = selectedChoiceIndex !== undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom max-w-4xl">
          {!isStarted ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('quiz.title')}</CardTitle>
                <CardDescription>
                  {t('quiz.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('quiz.selectLanguage')}</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t('quiz.chooseLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questionCount">{t('quiz.questionCount')}</Label>
                  <Select value={questionCount} onValueChange={handleQuestionCountChange}>
                    <SelectTrigger id="questionCount">
                      <SelectValue placeholder={t('quiz.chooseNumber')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 {t('quiz.questionCount')}</SelectItem>
                      <SelectItem value="10">10 {t('quiz.questionCount')}</SelectItem>
                      <SelectItem value="20">20 {t('quiz.questionCount')}</SelectItem>
                      <SelectItem value="50">50 {t('quiz.questionCount')}</SelectItem>
                      <SelectItem value="100">100 {t('quiz.questionCount')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={startQuiz} className="w-full" disabled={loading}>
                  {loading ? t('quiz.loading') : t('quiz.startQuiz')}
                </Button>
              </CardFooter>
            </Card>
          ) : isFinished ? (
            <QuizResult 
              score={calculateScore()} 
              onRestart={restartQuiz}
              timeSpent={quizStartTime && quizEndTime 
                ? Math.floor((quizEndTime.getTime() - quizStartTime.getTime()) / 1000)
                : 0}
              questions={quizQuestions}
              answers={selectedAnswers}
            />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold">
                    {t('quiz.question')} {currentQuestionIndex + 1} {t('quiz.of')} {quizQuestions.length}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                      {currentQuestion.language}
                    </span>
                    <Badge variant="outline" className={
                      currentQuestion.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-100' :
                      currentQuestion.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }>
                      {t(`difficulty: ${currentQuestion.difficulty}`)}
                    </Badge>
                  </div>
                </div>
                <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg font-medium">{currentQuestion.questionText}</p>
                
                <RadioGroup 
                  value={selectedChoiceIndex !== undefined ? selectedChoiceIndex.toString() : undefined}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="space-y-3"
                >
                  {currentQuestion.choices.map((choice: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-md border ${
                        selectedChoiceIndex === index ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                        {choice.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={restartQuiz}>{t('quiz.restartQuiz')}</Button>
                <Button 
                  onClick={nextQuestion} 
                  disabled={!isAnswerSelected}
                >
                  {currentQuestionIndex + 1 === quizQuestions.length ? t('quiz.finishQuiz') : t('quiz.nextQuestion')}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Quiz;
