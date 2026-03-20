import { create } from 'zustand';

export interface FeedbackData {
  score: number;
  overall_feedback: string;
  posture_details: {
    part: string;
    issue: string;
    correction: string;
  }[];
}

interface FeedbackStore {
  feedbackData: FeedbackData | null;
  setFeedbackData: (data: FeedbackData) => void;
  clearFeedbackData: () => void;
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedbackData: null,
  setFeedbackData: (data) => set({ feedbackData: data }),
  clearFeedbackData: () => set({ feedbackData: null }),
}));
