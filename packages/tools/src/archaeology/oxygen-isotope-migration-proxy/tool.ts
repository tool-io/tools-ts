import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly enamelDelta18O: number;
  readonly waterConversionSlope: number;
  readonly waterConversionIntercept: number;
  readonly conversionResidualSigma: number;
  readonly measurementSigma: number;
  readonly localWaterMean: number;
  readonly localWaterSigma: number;
  readonly callerZThreshold: number;
}>;
export type Output = Readonly<{
  readonly inferredWaterDelta18O: number;
  readonly combinedComparisonSigma: number;
  readonly signedLocalComparisonZ: number;
  readonly aboveCallerDifferenceThreshold: boolean;
}>;
const inputFields = [
  { id: "enamelDelta18O", label: "Enamel delta18 o", kind: "number" },
  {
    id: "waterConversionSlope",
    label: "Water conversion slope",
    kind: "number",
  },
  {
    id: "waterConversionIntercept",
    label: "Water conversion intercept",
    kind: "number",
  },
  {
    id: "conversionResidualSigma",
    label: "Conversion residual sigma",
    kind: "number",
  },
  { id: "measurementSigma", label: "Measurement sigma", kind: "number" },
  { id: "localWaterMean", label: "Local water mean", kind: "number" },
  { id: "localWaterSigma", label: "Local water sigma", kind: "number" },
  { id: "callerZThreshold", label: "Caller z threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerZThreshold, "callerZThreshold");
  nonnegative(input.measurementSigma, "measurementSigma");
  nonnegative(input.conversionResidualSigma, "conversionResidualSigma");
  nonnegative(input.localWaterSigma, "localWaterSigma");
  const inferredWaterDelta18O =
      input.waterConversionSlope * input.enamelDelta18O +
      input.waterConversionIntercept,
    combinedComparisonSigma = positive(
      Math.hypot(
        input.waterConversionSlope * input.measurementSigma,
        input.conversionResidualSigma,
        input.localWaterSigma,
      ),
      "uncertainty",
    ),
    signedLocalComparisonZ =
      (inferredWaterDelta18O - input.localWaterMean) / combinedComparisonSigma;
  return {
    inferredWaterDelta18O,
    combinedComparisonSigma,
    signedLocalComparisonZ,
    aboveCallerDifferenceThreshold:
      Math.abs(signedLocalComparisonZ) > input.callerZThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  enamelDelta18O: 10,
  waterConversionSlope: 0.5,
  waterConversionIntercept: -10,
  conversionResidualSigma: 1,
  measurementSigma: 2,
  localWaterMean: -6,
  localWaterSigma: 1,
  callerZThreshold: 2,
} satisfies Input;
export const exampleOutput = {
  inferredWaterDelta18O: -5,
  combinedComparisonSigma: 1.7320508075688772,
  signedLocalComparisonZ: 0.5773502691896258,
  aboveCallerDifferenceThreshold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/oxygen-isotope-migration-proxy",
  title: "Oxygen Isotope Migration Proxy Tool",
  description:
    "Apply caller enamel-to-water isotope calibration and compare a local baseline with independent uncertainty; differing isotope state is not proof of migration, birthplace or ancestry.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredWaterDelta18O",
      label: "Inferred water delta18 o",
      kind: "number",
    },
    {
      id: "combinedComparisonSigma",
      label: "Combined comparison sigma",
      kind: "number",
    },
    {
      id: "signedLocalComparisonZ",
      label: "Signed local comparison z",
      kind: "number",
    },
    {
      id: "aboveCallerDifferenceThreshold",
      label: "Above caller difference threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      enamelDelta18O: value.enamelDelta18O as number,
      waterConversionSlope: value.waterConversionSlope as number,
      waterConversionIntercept: value.waterConversionIntercept as number,
      conversionResidualSigma: value.conversionResidualSigma as number,
      measurementSigma: value.measurementSigma as number,
      localWaterMean: value.localWaterMean as number,
      localWaterSigma: value.localWaterSigma as number,
      callerZThreshold: value.callerZThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
