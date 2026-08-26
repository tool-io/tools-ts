import { describe, expect, it } from "vitest";
import {
  germinationRateIndexExample,
  runGerminationRateIndex,
} from "./tool.js";

describe("Germination Rate Index", () => {
  it("publishes an executable example", () =>
    expect(runGerminationRateIndex(germinationRateIndexExample.input)).toEqual({
      ok: true,
      output: germinationRateIndexExample.output,
    }));
  it("returns one hundred when everything germinates on day one", () =>
    expect(
      runGerminationRateIndex({
        day1Count: 50,
        day2Count: 0,
        seedsSownInt: 50,
      }),
    ).toEqual({ ok: true, output: { germinationRateIndex: 100 } }));
  it("halves weights for second-day germinations", () =>
    expect(
      runGerminationRateIndex({
        day1Count: 0,
        day2Count: 50,
        seedsSownInt: 50,
      }),
    ).toEqual({ ok: true, output: { germinationRateIndex: 50 } }));
  it("combines both days in a weighted sum", () =>
    expect(
      runGerminationRateIndex({
        day1Count: 10,
        day2Count: 10,
        seedsSownInt: 20,
      }),
    ).toEqual({ ok: true, output: { germinationRateIndex: 75 } }));
  it("returns zero when nothing germinates", () =>
    expect(
      runGerminationRateIndex({ day1Count: 0, day2Count: 0, seedsSownInt: 30 }),
    ).toEqual({ ok: true, output: { germinationRateIndex: 0 } }));
  it("rejects zero seeds sown", () =>
    expect(
      runGerminationRateIndex({ day1Count: 5, day2Count: 5, seedsSownInt: 0 })
        .ok,
    ).toBe(false));
  it("rejects negative day counts", () => {
    expect(
      runGerminationRateIndex({ day1Count: -1, day2Count: 5, seedsSownInt: 10 })
        .ok,
    ).toBe(false);
    expect(
      runGerminationRateIndex({ day1Count: 5, day2Count: -2, seedsSownInt: 10 })
        .ok,
    ).toBe(false);
  });
  it("rejects non-integer counts", () =>
    expect(
      runGerminationRateIndex({
        day1Count: 2.5,
        day2Count: 5,
        seedsSownInt: 10,
      }).ok,
    ).toBe(false));
  it("rejects cumulative counts above seeds sown", () =>
    expect(
      runGerminationRateIndex({ day1Count: 8, day2Count: 5, seedsSownInt: 10 })
        .ok,
    ).toBe(false));
});
