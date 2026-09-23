import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SiteSettings } from "@/lib/site-settings";

interface SiteSettingsState {
  data: SiteSettings | null;
  hydrated: boolean;
}

const initialState: SiteSettingsState = {
  data: null,
  hydrated: false,
};

const siteSettingsSlice = createSlice({
  name: "siteSettings",
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<SiteSettings | null>) {
      state.data = action.payload;
      state.hydrated = true;
    },
  },
});

export const { setSettings } = siteSettingsSlice.actions;

export const makeStore = (preloadedSettings: SiteSettings | null = null) =>
  configureStore({
    reducer: {
      siteSettings: siteSettingsSlice.reducer,
    },
    preloadedState: {
      siteSettings: { data: preloadedSettings, hydrated: preloadedSettings !== null },
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
