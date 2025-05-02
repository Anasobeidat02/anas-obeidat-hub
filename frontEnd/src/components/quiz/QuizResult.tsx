
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, X } from 'lucide-react';
import { Question } from '@/lib/types/question';

interface QuizResultProps {
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  timeSpent: number;
  onRestart: () => void;
  questions: any[];
  answers: Record<string, number>;
}

const QuizResult = ({ score, timeSpent, onRestart, questions, answers }: QuizResultProps) => {
  // Format time spent for display (convert seconds to minutes and seconds)
  const formatTimeSpent = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Get feedback message based on score percentage
  const getFeedbackMessage = (percentage: number) => {
    if (percentage >= 90) {
      return "Excellent! You're a programming master!";
    } else if (percentage >= 70) {
      return "Great job! You have a solid understanding of the concepts.";
    } else if (percentage >= 50) {
      return "Good effort! You're on the right track, but there's room for improvement.";
    } else {
      return "Keep practicing! Review the concepts and try again.";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Quiz Results</CardTitle>
          <CardDescription>
            {getFeedbackMessage(score.percentage)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-center">
            <div className="bg-primary/5 rounded-lg p-6 flex-1">
              <div className="font-semibold text-gray-500">Score</div>
              <div className="text-4xl font-bold text-primary">
                {score.percentage}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {score.correct} of {score.total} correct answers
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-6 flex-1">
              <div className="font-semibold text-gray-500">Time Spent</div>
              <div className="flex justify-center items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{formatTimeSpent(timeSpent)}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round(timeSpent / score.total)} seconds per question
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart} size="lg">
            Take Another Quiz
          </Button>
        </CardFooter>
      </Card>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle>Review Your Answers</CardTitle>
          <CardDescription>
            See which questions you got right and wrong.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const selectedChoiceIndex = answers[question._id];
              const isCorrect = selectedChoiceIndex !== undefined && question.choices[selectedChoiceIndex].isCorrect;
              const correctChoiceIndex = question.choices.findIndex(choice => choice.isCorrect);
              
              return (
                <div key={question._id} className="border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <p className="font-medium mb-2">
                        Q{index + 1}: {question.questionText}
                      </p>
                      <div className="space-y-2 mt-3">
                        {question.choices.map((choice, choiceIndex) => (
                          <div 
                            key={choiceIndex}
                            className={`p-2 rounded-md ${
                              selectedChoiceIndex === choiceIndex
                                ? isCorrect 
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                                : choiceIndex === correctChoiceIndex
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center">
                              {selectedChoiceIndex === choiceIndex ? (
                                isCorrect ? (
                                  <Check className="text-green-600 h-4 w-4 mr-2 flex-shrink-0" />
                                ) : (
                                  <X className="text-red-600 h-4 w-4 mr-2 flex-shrink-0" />
                                )
                              ) : choiceIndex === correctChoiceIndex ? (
                                <Check className="text-green-600 h-4 w-4 mr-2 opacity-50 flex-shrink-0" />
                              ) : null}
                              <span>{choice.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4">
                      {isCorrect ? (
                        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          <Check className="h-3 w-3 mr-1" />
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                          <X className="h-3 w-3 mr-1" />
                          Incorrect
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResult;
