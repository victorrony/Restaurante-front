import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem, Category } from '../../types';
import { menuAPI } from '../../services/api';

interface MenuState {
  items: MenuItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (_, { rejectWithValue }) => {
    try {
      const items = await menuAPI.getMenuItems();
      return items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao carregar menu');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'menu/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await menuAPI.getCategories();
      return categories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao carregar categorias');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (item: Omit<MenuItem, 'id' | 'category'>, { rejectWithValue }) => {
    try {
      const newItem = await menuAPI.createMenuItem(item);
      return newItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao criar item');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ id, item }: { id: string; item: Partial<MenuItem> }, { rejectWithValue }) => {
    try {
      const updatedItem = await menuAPI.updateMenuItem(id, item);
      return updatedItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao atualizar item');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch menu items
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
      })
      // Create menu item
      .addCase(createMenuItem.fulfilled, (state, action: PayloadAction<MenuItem>) => {
        state.items.push(action.payload);
      })
      // Update menu item
      .addCase(updateMenuItem.fulfilled, (state, action: PayloadAction<MenuItem>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearError } = menuSlice.actions;
export default menuSlice.reducer;
