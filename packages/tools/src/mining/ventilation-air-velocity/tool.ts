import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedTraverseCellAreasM2: readonly number[];
  readonly observedTraverseNormalSpeedsMSecond: readonly number[];
  readonly observedIndependentDuctFlowM3Second: number;
}>;
export type Output = Readonly<{
  readonly areaIntegratedObservedVentilationM3Second: number;
  readonly signedDuctFlowDiscrepancyM3Second: number;
}>;
const inputFields = [
  {
    id: "observedTraverseCellAreasM2",
    label: "Observed traverse cell areas m2",
    kind: "numberList",
  },
  {
    id: "observedTraverseNormalSpeedsMSecond",
    label: "Observed traverse normal speeds m second",
    kind: "numberList",
  },
  {
    id: "observedIndependentDuctFlowM3Second",
    label: "Observed independent duct flow m3 second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTraverseCellAreasM2.forEach((v) =>
    positive(v, "observedTraverseCellAreasM2"),
  );
  aligned(
    input.observedTraverseCellAreasM2,
    input.observedTraverseNormalSpeedsMSecond,
    "observedTraverseCellAreasM2",
  );
  const q = sum(
    input.observedTraverseCellAreasM2.map(
      (v, i) => v * input.observedTraverseNormalSpeedsMSecond[i],
    ),
  );
  return {
    areaIntegratedObservedVentilationM3Second: q,
    signedDuctFlowDiscrepancyM3Second:
      input.observedIndependentDuctFlowM3Second - q,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTraverseCellAreasM2: [1, 2],
  observedTraverseNormalSpeedsMSecond: [2, 1],
  observedIndependentDuctFlowM3Second: 5,
} satisfies Input;
export const exampleOutput = {
  areaIntegratedObservedVentilationM3Second: 4,
  signedDuctFlowDiscrepancyM3Second: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ventilation-air-velocity",
  title: "Ventilation Air Velocity Calculator",
  description:
    "Integrate signed actual velocity traverse cells and compare independent mine duct flow, not Q/A or steady contaminant dilution alone. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaIntegratedObservedVentilationM3Second",
      label: "Area integrated observed ventilation m3 second",
      kind: "number",
    },
    {
      id: "signedDuctFlowDiscrepancyM3Second",
      label: "Signed duct flow discrepancy m3 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTraverseCellAreasM2:
        value.observedTraverseCellAreasM2 as readonly number[],
      observedTraverseNormalSpeedsMSecond:
        value.observedTraverseNormalSpeedsMSecond as readonly number[],
      observedIndependentDuctFlowM3Second:
        value.observedIndependentDuctFlowM3Second as number,
    }),
});
export const run = tool.execute;
export default tool;
