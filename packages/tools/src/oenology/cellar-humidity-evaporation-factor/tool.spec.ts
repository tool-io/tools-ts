import { describe, expect, it } from "vitest";
import {
  cellarHumidityEvaporationFactorExample,
  cellarHumidityEvaporationFactorTool,
  runCellarHumidityEvaporationFactor,
} from "./tool.js";

describe("cellarHumidityEvaporationFactorTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runCellarHumidityEvaporationFactor(
        cellarHumidityEvaporationFactorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: cellarHumidityEvaporationFactorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(cellarHumidityEvaporationFactorExample)),
    ).toEqual(cellarHumidityEvaporationFactorExample);
    expect(cellarHumidityEvaporationFactorTool.contractVersion).toBe(1);
    expect(cellarHumidityEvaporationFactorTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCellarHumidityEvaporationFactor(null).ok).toBe(false);
    expect(
      runCellarHumidityEvaporationFactor({
        ...cellarHumidityEvaporationFactorExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("uses the supplied sensitivity without hidden clamps", () => {
    expect(
      runCellarHumidityEvaporationFactor({
        humiditySensitivityPerPoint: 0.02,
        referenceHumidityPercent: 70,
        relativeHumidityPercent: 50,
      }),
    ).toEqual({ ok: true, output: { evaporationFactor: 1.4 } });
  });
});
