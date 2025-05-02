
export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  questionText: string;
  choices: Choice[];
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestionFormData {
  questionText: string;
  choices: {
    text: string;
    isCorrect: boolean;
  }[];
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
