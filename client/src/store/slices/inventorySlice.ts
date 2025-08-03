import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient } from '../../types';

interface InventoryState {
  ingredients: Ingredient[];
  lowStockCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  ingredients: [],
  lowStockCount: 0,
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<{ ingredients: Ingredient[]; lowStockCount: number }>) => {
      state.ingredients = action.payload.ingredients;
      state.lowStockCount = action.payload.lowStockCount;
    },
    updateIngredient: (state, action: PayloadAction<Ingredient>) => {
      const index = state.ingredients.findIndex(ing => ing.id === action.payload.id);
      if (index !== -1) {
        state.ingredients[index] = action.payload;
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

export const { setIngredients, updateIngredient, setLoading, setError } = inventorySlice.actions;
export default inventorySlice.reducer;
