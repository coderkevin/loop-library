export {};

declare global {
  interface Window {
    loopLibrary: {
      ping: () => string;
    };
  }
}


