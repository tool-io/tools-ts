import { describe, expect, it } from "vitest";
import {
  calculateFeedingFrequency,
  example,
  runFeedingFrequency,
} from "./tool.js";

describe("aquaculture/feeding-frequency", () => {
  it("calculates the published example", () => {
    expect(calculateFeedingFrequency(example.input)).toEqual(example.output);
    expect(runFeedingFrequency(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runFeedingFrequency({
      ...example.input,
      dailyFeedKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runFeedingFrequency({ ...example.input, maxFeedPerMealKilograms: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maxFeedPerMealKilograms" }] },
    });
  });
});
