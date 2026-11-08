import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      // Count every app file, including ones with no tests yet.
      include: ["js/**/*.js"],
      reporter: ["text", "html"],
    },
  },
});
