import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly measuredCrossSectionSegmentsM: readonly number[];
  readonly greenhouseLengthM: number;
  readonly callerSideTotalAnchorAllowanceM: number;
  readonly callerEndTotalAllowanceM: number;
}>;
export type Output = Readonly<{
  readonly requiredContinuousCoverWidthM: number;
  readonly requiredContinuousCoverLengthM: number;
  readonly requiredContinuousCoverAreaM2: number;
}>;
const inputFields = [
  {
    id: "measuredCrossSectionSegmentsM",
    label: "Measured cross section segments m",
    kind: "numberList",
  },
  { id: "greenhouseLengthM", label: "Greenhouse length m", kind: "number" },
  {
    id: "callerSideTotalAnchorAllowanceM",
    label: "Caller side total anchor allowance m",
    kind: "number",
  },
  {
    id: "callerEndTotalAllowanceM",
    label: "Caller end total allowance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredCrossSectionSegmentsM.forEach((v) =>
    positive(v, "measuredCrossSectionSegmentsM"),
  );
  positive(input.greenhouseLengthM, "greenhouseLengthM");
  nonnegative(
    input.callerSideTotalAnchorAllowanceM,
    "callerSideTotalAnchorAllowanceM",
  );
  nonnegative(input.callerEndTotalAllowanceM, "callerEndTotalAllowanceM");
  if (!input.measuredCrossSectionSegmentsM.length)
    simpleError("profile", "Measured cover path segments required.");
  const width =
      sum(input.measuredCrossSectionSegmentsM) +
      input.callerSideTotalAnchorAllowanceM,
    length = input.greenhouseLengthM + input.callerEndTotalAllowanceM;
  return {
    requiredContinuousCoverWidthM: width,
    requiredContinuousCoverLengthM: length,
    requiredContinuousCoverAreaM2: width * length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredCrossSectionSegmentsM: [3, 4, 3],
  greenhouseLengthM: 20,
  callerSideTotalAnchorAllowanceM: 2,
  callerEndTotalAllowanceM: 1,
} satisfies Input;
export const exampleOutput = {
  requiredContinuousCoverWidthM: 12,
  requiredContinuousCoverLengthM: 21,
  requiredContinuousCoverAreaM2: 252,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/covering-plastic-width-length",
  title: "Covering Plastic Width Length Calculator",
  description:
    "Inventory actual measured greenhouse cover-path segments plus explicit anchor/end allowances; no assumed semicircle geometry, roll-width nesting or structural/fire installation approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredContinuousCoverWidthM",
      label: "Required continuous cover width m",
      kind: "number",
    },
    {
      id: "requiredContinuousCoverLengthM",
      label: "Required continuous cover length m",
      kind: "number",
    },
    {
      id: "requiredContinuousCoverAreaM2",
      label: "Required continuous cover area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredCrossSectionSegmentsM:
        value.measuredCrossSectionSegmentsM as readonly number[],
      greenhouseLengthM: value.greenhouseLengthM as number,
      callerSideTotalAnchorAllowanceM:
        value.callerSideTotalAnchorAllowanceM as number,
      callerEndTotalAllowanceM: value.callerEndTotalAllowanceM as number,
    }),
});
export const run = tool.execute;
export default tool;
