import { describe, expect, it } from "vitest";
import { runPrecipitateMassFromAnalyte } from "./tool.js";
describe("Precipitate Mass From Analyte", () => {
  it("calculates a valid result", () =>
    expect(
      runPrecipitateMassFromAnalyte({
        analyteMassG: 0.2,
        gravimetricFactor: 0.4,
      }),
    ).toEqual({
      ok: true,
      output: { precipitateMassGrams: 0.5 },
    }));
  it("rejects invalid input", () =>
    expect(
      runPrecipitateMassFromAnalyte({
        analyteMassG: 0.2,
        gravimetricFactor: 0,
      }).ok,
    ).toBe(false));
});
