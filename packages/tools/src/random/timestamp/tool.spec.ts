import { describe, expect, it } from "vitest";
import {
  calculateRandomTimestampValue,
  randomTimestampExample,
  runRandomTimestamp,
} from "./tool.js";
describe("random timestamp", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomTimestamp(randomTimestampExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { timestamp: 1_767_225_600 } }));

  it("calculates from parsed millisecond bounds", () => {
    expect(
      calculateRandomTimestampValue(1_000, 2_000, "seconds", () => 0.5),
    ).toBe(2);
    expect(calculateRandomTimestampValue(2_000, 1_000, "seconds")).toBeNull();
  });
});
