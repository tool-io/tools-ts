import { describe, expect, it } from "vitest";
import { runReciprocal } from "./tool.js";
describe("Reciprocal Calculator", () => {
  it("calculates a valid result", () =>
    expect(runReciprocal({ value: 4 })).toEqual({
      ok: true,
      output: { reciprocal: 0.25 },
    }));
  it("rejects invalid input", () =>
    expect(runReciprocal({ value: 0 }).ok).toBe(false));
});
