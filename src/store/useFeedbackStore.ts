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
  videoUrl: string | null;
  setFeedbackData: (data: FeedbackData) => void;
  setVideoUrl: (url: string | null) => void;
  clearFeedbackData: () => void;
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedbackData: null,
  videoUrl: null,
  setFeedbackData: (data) => set({ feedbackData: data }),
  setVideoUrl: (url) => set({ videoUrl: url }),
  clearFeedbackData: () => set({ feedbackData: null, videoUrl: null }),
}));
