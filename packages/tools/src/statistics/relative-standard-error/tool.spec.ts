import { describe, expect, it } from "vitest";
import {
  relativeStandardErrorExample,
  runRelativeStandardError,
} from "./tool.js";
describe("Relative Standard Error Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runRelativeStandardError({ standardError: 2, estimate: 50 }),
    ).toEqual({ ok: true, output: { percent: 4 } });
  });
  it("rejects invalid input", () =>
    expect(runRelativeStandardError(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(
      runRelativeStandardError(relativeStandardErrorExample.input).ok,
    ).toBe(true));
});
