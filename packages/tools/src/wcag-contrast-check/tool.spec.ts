import { describe, expect, it } from "vitest";
import { runWcagContrast, wcagContrastExample } from "./tool.js";
describe("WCAG contrast", () => {
  it("publishes an executable example", () =>
    expect(runWcagContrast(wcagContrastExample.input)).toEqual({
      ok: true,
      output: wcagContrastExample.output,
    }));
});
