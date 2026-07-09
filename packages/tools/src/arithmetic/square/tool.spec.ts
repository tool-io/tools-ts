import { describe, expect, it } from "vitest";
import { runSquare } from "./tool.js";
describe("Square Calculator", () => {
  it("calculates a valid result", () =>
    expect(runSquare({ value: -5 })).toEqual({
      ok: true,
      output: { square: 25 },
    }));
  it("rejects invalid input", () => expect(runSquare(null).ok).toBe(false));
});
