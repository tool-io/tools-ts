import { describe, expect, it } from "vitest";
import { calculateStandardError, standardErrorExample } from "./tool.js";
describe("standard error", () => {
  it("calculates sigma over square root n", () =>
    expect(
      calculateStandardError({ standardDeviation: 10, sampleSize: 25 }),
    ).toEqual({ ok: true, output: { standardError: 2 } }));
  it("rejects invalid size", () =>
    expect(
      calculateStandardError({ standardDeviation: 1, sampleSize: 0 }).ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(calculateStandardError(standardErrorExample.input).ok).toBe(true));
});
