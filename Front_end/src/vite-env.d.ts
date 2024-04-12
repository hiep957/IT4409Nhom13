/*<reference types="vite/client" />*/

interface ImportMetaEnv {
    VITE_STRIPE_PUB_KEY: string;
    VITE_API_BASE_URL?: string;
    // define other environment variables if needed
  }
  
  interface ImportMeta {
    env: ImportMetaEnv;
  }