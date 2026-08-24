import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TdbdWeibullSlopeInput = {
  readonly testTimeSeconds: number;
  readonly characteristicLifeSeconds: number;
  readonly shapeBeta: number;
};

export type TdbdWeibullSlopeOutput = {
  readonly failureFraction: number;
};

export const tdbdWeibullSlopeExample = {
  input: {
    characteristicLifeSeconds: 1000,
    shapeBeta: 2,
    testTimeSeconds: 1000,
  },
  output: { failureFraction: 0.6321205588285577 },
} satisfies ToolExample<TdbdWeibullSlopeInput, TdbdWeibullSlopeOutput>;

export const tdbdWeibullSlopeTool = createSimpleTool({
  id: "semiconductor/tdbd-weibull-slope",
  title: "TDDB Weibull Failure Fraction Calculator",
  description:
    "Compute the time dependent dielectric breakdown failed fraction from stress time using a two-parameter Weibull model.",
  inputs: [
    {
      description: "Cumulative gate oxide stress duration.",
      id: "testTimeSeconds",
      kind: "number",
      label: "Test time",
      minimum: 0,
      unit: "s",
    },
    {
      description: "Weibull characteristic life at which 63.2 percent fail.",
      id: "characteristicLifeSeconds",
      kind: "number",
      label: "Characteristic life",
      minimum: 0,
      unit: "s",
    },
    {
      description:
        "Weibull shape parameter controlling the failure rate trend.",
      id: "shapeBeta",
      kind: "number",
      label: "Shape beta",
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "fraction",
      id: "failureFraction",
      kind: "number",
      label: "Failure fraction",
    },
  ],
  calculate: (input) => {
    const characteristicLifeSeconds = input.characteristicLifeSeconds as number;
    const shapeBeta = input.shapeBeta as number;
    if (!(characteristicLifeSeconds > 0))
      simpleError(
        "characteristicLifeSeconds",
        "Characteristic life must be greater than zero.",
      );
    if (!(shapeBeta > 0))
      simpleError("shapeBeta", "Shape beta must be greater than zero.");
    const cumulativeHazard = Math.pow(
      (input.testTimeSeconds as number) / characteristicLifeSeconds,
      shapeBeta,
    );
    return { failureFraction: -Math.expm1(-cumulativeHazard) };
  },
});
export const runTdbdWeibullSlope = tdbdWeibullSlopeTool.execute;
export default tdbdWeibullSlopeTool;
