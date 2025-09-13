import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Table } from "../../types";

interface TablesState {
   tables: Table[];
   loading: boolean;
   error: string | null;
}

const initialState: TablesState = {
   tables: [],
   loading: false,
   error: null,
};

const tablesSlice = createSlice({
   name: "tables",
   initialState,
   reducers: {
      setTables: (state, action: PayloadAction<Table[]>) => {
         state.tables = action.payload;
      },
      addTable: (state, action: PayloadAction<Table>) => {
         state.tables.push(action.payload);
      },
      updateTable: (state, action: PayloadAction<Table>) => {
         const index = state.tables.findIndex((table) => table.id === action.payload.id);
         if (index !== -1) {
            state.tables[index] = action.payload;
         } else {
            // If table doesn't exist, add it
            state.tables.push(action.payload);
         }
      },
      setLoading: (state, action: PayloadAction<boolean>) => {
         state.loading = action.payload;
      },
      setError: (state, action: PayloadAction<string | null>) => {
         state.error = action.payload;
      },
   },
});

export const { setTables, addTable, updateTable, setLoading, setError } = tablesSlice.actions;
export default tablesSlice.reducer;
