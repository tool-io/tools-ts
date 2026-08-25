import { describe, expect, it } from "vitest";
import {
  coldStabilizationChillExample,
  coldStabilizationChillTool,
  runColdStabilizationChill,
} from "./tool.js";

describe("coldStabilizationChillTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runColdStabilizationChill(coldStabilizationChillExample.input),
    ).toEqual({
      ok: true,
      output: coldStabilizationChillExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(coldStabilizationChillExample))).toEqual(
      coldStabilizationChillExample,
    );
    expect(coldStabilizationChillTool.contractVersion).toBe(1);
    expect(coldStabilizationChillTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runColdStabilizationChill(null).ok).toBe(false);
    expect(
      runColdStabilizationChill({
        ...coldStabilizationChillExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("cold stabilization chill boundaries", () => {
  it("rejects identical start and end temperatures", () => {
    expect(
      runColdStabilizationChill({
        densityKgPerLiter: 0.99,
        endTemperatureC: 15,
        specificHeatKjPerKgK: 4,
        startTemperatureC: 15,
        volumeLiters: 1000,
      }).ok,
    ).toBe(false);
  });

  it("scales linearly with volume", () => {
    const small = runColdStabilizationChill({
      densityKgPerLiter: 0.99,
      endTemperatureC: -4,
      specificHeatKjPerKgK: 4,
      startTemperatureC: 15,
      volumeLiters: 500,
    });
    expect(small.ok && small.output.energyKwh).toBeCloseTo(10.45, 6);
  });

  it("rejects warming as a chilling load", () => {
    expect(
      runColdStabilizationChill({
        densityKgPerLiter: 0.99,
        endTemperatureC: 20,
        specificHeatKjPerKgK: 4,
        startTemperatureC: 15,
        volumeLiters: 1000,
      }).ok,
    ).toBe(false);
  });
});
