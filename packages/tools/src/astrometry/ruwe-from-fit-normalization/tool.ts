import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, count } from "../shared.js";

export type Input = Readonly<{
  readonly chiSquare: number;
  readonly goodObservations: number;
  readonly fittedParameters: number;
  readonly normalizationU0: number;
  readonly maximumRuwe: number;
}>;
export type Output = Readonly<{
  readonly unitWeightError: number;
  readonly ruweValue: number;
  readonly passesSuppliedCriterion: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.chiSquare, "chiSquare");
  count(input.goodObservations, "goodObservations", 1);
  count(input.fittedParameters, "fittedParameters");
  positive(input.normalizationU0, "normalizationU0");
  positive(input.maximumRuwe, "maximumRuwe");
  const df = input.goodObservations - input.fittedParameters;
  positive(df, "fittedParameters");
  const unitWeightError = Math.sqrt(input.chiSquare / df),
    ruweValue = unitWeightError / input.normalizationU0;
  return {
    unitWeightError,
    ruweValue,
    passesSuppliedCriterion: ruweValue <= input.maximumRuwe,
  };
};
export const exampleInput = {
  chiSquare: 20,
  goodObservations: 10,
  fittedParameters: 5,
  normalizationU0: 2,
  maximumRuwe: 1.4,
} satisfies Input;
export const exampleOutput = {
  unitWeightError: 2,
  ruweValue: 1,
  passesSuppliedCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/ruwe-from-fit-normalization",
  title: "Ruwe From Fit Normalization",
  description:
    "Derive RUWE from chi-square, fit degrees of freedom, and caller-supplied magnitude/color normalization; no catalog calibration table is embedded.",
  inputs: [
    { id: "chiSquare", label: "Chi square", kind: "number" },
    { id: "goodObservations", label: "Good observations", kind: "integer" },
    { id: "fittedParameters", label: "Fitted parameters", kind: "integer" },
    { id: "normalizationU0", label: "Normalization u 0", kind: "number" },
    { id: "maximumRuwe", label: "Maximum ruwe", kind: "number" },
  ],
  outputs: [
    { id: "unitWeightError", label: "Unit weight error", kind: "number" },
    { id: "ruweValue", label: "Ruwe value", kind: "number" },
    {
      id: "passesSuppliedCriterion",
      label: "Passes supplied criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      chiSquare: value.chiSquare as number,
      goodObservations: value.goodObservations as number,
      fittedParameters: value.fittedParameters as number,
      normalizationU0: value.normalizationU0 as number,
      maximumRuwe: value.maximumRuwe as number,
    }),
});
export const run = tool.execute;
export default tool;
