export const reportToolError = (error: unknown) => ({
  success: false,
  data: undefined,
  error: error instanceof Error ? error.message : String(error),
});
