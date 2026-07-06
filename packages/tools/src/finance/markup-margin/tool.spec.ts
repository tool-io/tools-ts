import { describe, expect, it } from "vitest";
import { runMarkupMargin } from "./tool.js";
describe("Markup and Margin Converter", () => {
  it("calculates a valid result", () => {
    const result = runMarkupMargin({ percent: 25, mode: "markup-to-margin" });
    expect(result.ok && result.output.percent).toBeCloseTo(20);
  });
  it("rejects invalid input", () =>
    expect(runMarkupMargin({ percent: 25, mode: "bad" }).ok).toBe(false));
});
