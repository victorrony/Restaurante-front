import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Feedback } from '../../types';

interface FeedbackState {
  feedbacks: Feedback[];
  statistics: any;
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedbacks: [],
  statistics: null,
  loading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedbacks: (state, action: PayloadAction<{ feedbacks: Feedback[]; statistics: any }>) => {
      state.feedbacks = action.payload.feedbacks;
      state.statistics = action.payload.statistics;
    },
    addFeedback: (state, action: PayloadAction<Feedback>) => {
      state.feedbacks.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setFeedbacks, addFeedback, setLoading, setError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
