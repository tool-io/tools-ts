import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateNefNoiseExposureForecastLegacyMethodLookup,
  example,
} from "./tool.js";

describe("acoustics/noise-exposure-forecast-calculator", () => {
  it("executes its canonical example exactly", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("returns zero NEF for 88 EPNdB and one daytime operation", () => {
    expect(
      calculateNefNoiseExposureForecastLegacyMethodLookup({
        daytimeOperations: 1,
        effectivePerceivedNoiseLevelDecibels: 88,
        method: "us-nef",
        nighttimeOperations: 0,
      }).nefDecibels,
    ).toBe(0);
  });

  it("rejects an empty operation set", () => {
    expect(
      tool.execute({
        daytimeOperations: 0,
        effectivePerceivedNoiseLevelDecibels: 88,
        method: "us-nef",
        nighttimeOperations: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "empty_operation_set", field: "daytimeOperations" }],
      },
      ok: false,
    });
  });
});
