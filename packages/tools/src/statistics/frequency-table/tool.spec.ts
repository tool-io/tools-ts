import { describe, expect, it } from "vitest";
import { frequencyTableExample, runFrequencyTable } from "./tool.js";
describe("Frequency Table Generator", () => {
  it("calculates a valid result", () => {
    expect(runFrequencyTable({ values: [2, 1, 2] })).toEqual({
      ok: true,
      output: {
        table: {
          entries: [
            { value: 1, count: 1 },
            { value: 2, count: 2 },
          ],
        },
      },
    });
  });
  it("rejects invalid input", () =>
    expect(runFrequencyTable(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runFrequencyTable(frequencyTableExample.input).ok).toBe(true));
});
