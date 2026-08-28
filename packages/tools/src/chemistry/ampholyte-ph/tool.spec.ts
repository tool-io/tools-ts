import { describe, expect, it } from "vitest";
import { runAmpholytePh } from "./tool.js";

describe("Ampholyte pH Calculator", () => {
  it("calculates a valid result", () => {
    const result = runAmpholytePh({ pka1: 1, pka2: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ph).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runAmpholytePh(null).ok).toBe(false));
});
