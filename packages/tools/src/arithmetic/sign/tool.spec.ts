import { describe, expect, it } from "vitest";
import { runSign } from "./tool.js";
describe("Sign of Number Calculator", () => {
  it("calculates a valid result", () =>
    expect(runSign({ value: -4 })).toEqual({ ok: true, output: { sign: -1 } }));
  it("rejects invalid input", () => expect(runSign(null).ok).toBe(false));
});
