import { describe, expect, it } from "vitest";
import { runZeroFuelWeight } from "./tool.js";

describe("zero fuel weight calculator", () => {
  it("sums empty weight and payload", () => {
    expect(
      runZeroFuelWeight({ basicEmptyWeightLb: 1600, payloadLb: 500 }),
    ).toEqual({
      ok: true,
      output: { zeroFuelWeightLb: 2100 },
    });
  });
});
