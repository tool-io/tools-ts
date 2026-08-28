import { describe, expect, it } from "vitest";
import { runInhibitionConstantKi } from "./tool.js";

describe("Inhibition Constant Ki Calculator", () => {
  it("calculates a valid result", () => {
    const result = runInhibitionConstantKi({ ic50: 1, substrateS: 1, km: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ki).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runInhibitionConstantKi(null).ok).toBe(false));
});
