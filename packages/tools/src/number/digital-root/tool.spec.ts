import { describe, expect, it } from "vitest";
import { runDigitalRoot } from "./tool.js";
describe("Digital Root Calculator", () => {
  it("calculates a valid result", () =>
    expect(runDigitalRoot({ value: 9875 })).toEqual({
      ok: true,
      output: { digitalRoot: 2 },
    }));
  it("rejects invalid input", () =>
    expect(runDigitalRoot(null).ok).toBe(false));
});
