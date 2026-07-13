import { describe, expect, it } from "vitest";
import { runAbsoluteValue } from "./tool.js";

describe("Absolute Value Calculator", () => {
  it("returns a nonnegative value", () =>
    expect(runAbsoluteValue({ value: -12.5 })).toEqual({
      ok: true,
      output: { absoluteValue: 12.5 },
    }));

  it("rejects non-finite input", () =>
    expect(runAbsoluteValue({ value: Number.NaN }).ok).toBe(false));
});
