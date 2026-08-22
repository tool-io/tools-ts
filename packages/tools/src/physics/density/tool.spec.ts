import { describe, expect, it } from "vitest";
import { runDensity } from "./tool.js";

describe("Density Calculator", () => {
  it("computes density for 10g in 2cm3", () => {
    const result = runDensity({ massG: 10, volumeCm3: 2 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.densityGCm3).toBe(5);
  });

  it("rejects invalid input", () => expect(runDensity(null).ok).toBe(false));
});
