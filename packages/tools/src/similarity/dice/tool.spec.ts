import { describe, expect, it } from "vitest";
import { runDice } from "./tool.js";
describe("Sørensen–Dice Similarity Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDice({ first: ["a", "b"], second: ["b", "c"] })).toEqual({
      ok: true,
      output: { similarity: 0.5 },
    });
  });
  it("rejects invalid input", () => expect(runDice(null).ok).toBe(false));
});
