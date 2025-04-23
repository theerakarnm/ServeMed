export { }; // This ensures the file is treated as a module.

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ENV: Record<string, any>
  }
}
