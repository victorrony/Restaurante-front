import { createSlice } from "@reduxjs/toolkit";

interface ReportsState {
   salesReport: any | null;
   loading: boolean;
   error: string | null;
}

const initialState: ReportsState = {
   salesReport: null,
   loading: false,
   error: null,
};

const reportsSlice = createSlice({
   name: "reports",
   initialState,
   reducers: {
      fetchSalesReportStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      fetchSalesReportSuccess: (state, action) => {
         state.loading = false;
         state.salesReport = action.payload;
      },
      fetchSalesReportFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },
   },
});

export const { fetchSalesReportStart, fetchSalesReportSuccess, fetchSalesReportFailure } = reportsSlice.actions;

export default reportsSlice.reducer;
