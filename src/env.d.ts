interface ImportMetaEnv {
    readonly VITE_REACT_APP_GOOGLE_CLIENT_ID: string
    readonly VITE_REACT_APP_API_KEY: string
    readonly VITE_REACT_APP_APP_ID: string
    readonly VITE_REACT_APP_PROGRAM_NO: string
    // Add other environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }