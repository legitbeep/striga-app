export const KEYS = {
  apiKey: process.env.VITE_STRIGA_API_KEY,
  apiSecret: process.env.VITE_STRIGA_API_SECRET,
  appId: process.env.VITE_STRIGA_APP_ID,
  uiSecret: process.env.VITE_STRIGA_UI_SECRET,
  tokenStorage: "tokens",
};

export const strigaConfig = {
  baseUrl: "https://staging-sandbox.striga.com/sfc",
};
