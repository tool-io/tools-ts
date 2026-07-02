import { describe, expect, it } from "vitest";
import { runClamp } from "./tool.js";
describe("Clamp Number to Range", () => {
  it("calculates a valid result", () =>
    expect(runClamp({ value: 12, minimum: 0, maximum: 10 })).toEqual({
      ok: true,
      output: { result: 10 },
    }));
  it("rejects invalid input", () =>
    expect(runClamp({ value: 1, minimum: 2, maximum: 1 }).ok).toBe(false));
});
