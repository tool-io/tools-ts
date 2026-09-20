import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateRollingWindowAggregateTrace,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Rolling aggregate trace", () => {
  lightweightModelTests(tool, calculateRollingWindowAggregateTrace, example);
  it("lightweight independently preserves empty and partial-window semantics", () => {
    expect(
      tool.execute({
        length: 0,
        windowSize: 3,
        minimumValue: -2,
        maximumValue: 2,
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        stream: [],
        events: [
          {
            start: 0,
            endExclusive: 0,
            values: [],
            sum: 0,
            mean: null,
            minimum: null,
            maximum: null,
          },
        ],
        fullWindows: [],
      },
    });
    expect(
      tool.execute({
        length: 2,
        windowSize: 3,
        minimumValue: -2,
        maximumValue: -2,
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        stream: [-2, -2],
        events: [{ sum: 0 }, { sum: -2, mean: -2 }, { sum: -4, mean: -2 }],
        fullWindows: [],
      },
    });
  });
  it("lightweight reports unsafe exact sums and invalid window widths", () => {
    expect(
      tool.execute({
        length: 2,
        windowSize: 2,
        minimumValue: Number.MAX_SAFE_INTEGER,
        maximumValue: Number.MAX_SAFE_INTEGER,
        seed: 42,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "windowSize", code: "unsafe_aggregate" }] },
    });
    expect(tool.execute({ ...example.input, windowSize: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "windowSize", code: "invalid_field" }] },
    });
  });
});
