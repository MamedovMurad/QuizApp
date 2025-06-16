export type QuestionType = 'single' | 'multiple' | 'blanks' | "yesno" | "ordering" | "dragdrop";

export interface Option {
  id: number;
  text: string;
}

export interface BlankOption {
  id: number;
  text: string;
}

export interface Blank {
  id: number;
  position: number;
  options: BlankOption[];
}
export interface YesNoLine {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  title: string;
  image?: string;
  options?: Option[];    // For "single", "multiple", maybe "yesno"
  lines?: YesNoLine[];   // For "yesno" type
  blanks?: Blank[];      // For "blanks" type
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
}
export interface QuestionResponse {
  id: number
  type: QuestionType;
  text: string;
}
