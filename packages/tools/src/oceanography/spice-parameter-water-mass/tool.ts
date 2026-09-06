import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerSpiceCalibrationIds: readonly string[];
  readonly callerSpiceCalibrationValues: readonly number[];
  readonly querySpiceCalibrationId: string;
  readonly observedSpiceCalibrationValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerSpiceCalibrationIds",
    label: "Caller spice calibration ids",
    kind: "stringList",
  },
  {
    id: "callerSpiceCalibrationValues",
    label: "Caller spice calibration values",
    kind: "numberList",
  },
  {
    id: "querySpiceCalibrationId",
    label: "Query spice calibration id",
    kind: "string",
  },
  {
    id: "observedSpiceCalibrationValue",
    label: "Observed spice calibration value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSpiceCalibrationIds,
    input.callerSpiceCalibrationValues,
    "callerSpiceCalibrationIds",
  );
  const i = catalogIndex(
    input.callerSpiceCalibrationIds,
    input.querySpiceCalibrationId,
  );
  return {
    callerMatchedReferenceValue: input.callerSpiceCalibrationValues[i],
    signedObservedMinusReference:
      input.observedSpiceCalibrationValue -
      input.callerSpiceCalibrationValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSpiceCalibrationIds: ["a", "b"],
  callerSpiceCalibrationValues: [2, 4],
  querySpiceCalibrationId: "b",
  observedSpiceCalibrationValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedReferenceValue: 4,
  signedObservedMinusReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/spice-parameter-water-mass",
  title: "Spice Parameter Water Mass Tool",
  description:
    "Audit independently supplied SAME spiciness formulation/reference pressure and water-mass key, no mixing TEOS/EOS definitions or forced identity. Independently verified caller edition/site/specimen reference, no fabricated table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedReferenceValue",
      label: "Caller matched reference value",
      kind: "number",
    },
    {
      id: "signedObservedMinusReference",
      label: "Signed observed minus reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSpiceCalibrationIds:
        value.callerSpiceCalibrationIds as readonly string[],
      callerSpiceCalibrationValues:
        value.callerSpiceCalibrationValues as readonly number[],
      querySpiceCalibrationId: value.querySpiceCalibrationId as string,
      observedSpiceCalibrationValue:
        value.observedSpiceCalibrationValue as number,
    }),
});
export const run = tool.execute;
export default tool;
