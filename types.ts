export type Sender = 'user' | 'bot';

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isError?: boolean;
  isInitial?: boolean;
}

export interface ChatResponse {
  answer: string;
}

export interface ChatRequest {
  query: string;
}