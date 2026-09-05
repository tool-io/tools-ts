import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  median,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedHomogenizationTemperaturesC: readonly number[];
  readonly callerVerifiedInclusionFamilyFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly matchedFamilyTemperaturesC: readonly number[];
  readonly familyMedianHomogenizationC: number;
}>;
const inputFields = [
  {
    id: "observedHomogenizationTemperaturesC",
    label: "Observed homogenization temperatures c",
    kind: "numberList",
  },
  {
    id: "callerVerifiedInclusionFamilyFlags",
    label: "Caller verified inclusion family flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.callerVerifiedInclusionFamilyFlags,
    "callerVerifiedInclusionFamilyFlags",
  );
  aligned(
    input.observedHomogenizationTemperaturesC,
    input.callerVerifiedInclusionFamilyFlags,
    "observedHomogenizationTemperaturesC",
  );
  const t = input.observedHomogenizationTemperaturesC.filter(
    (_, i) => input.callerVerifiedInclusionFamilyFlags[i] === 1,
  );
  return {
    matchedFamilyTemperaturesC: t,
    familyMedianHomogenizationC: median(t),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHomogenizationTemperaturesC: [100, 120, 110],
  callerVerifiedInclusionFamilyFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  matchedFamilyTemperaturesC: [100, 110],
  familyMedianHomogenizationC: 105,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fluid-inclusion-homogenization-temperature",
  title: "Geology Fluid Inclusion Homogenization Temperature Calculator",
  description:
    "Inventory homogenization measurements within independently same-generation inclusion family; not trapping temperature without pressure correction. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedFamilyTemperaturesC",
      label: "Matched family temperatures c",
      kind: "numberList",
    },
    {
      id: "familyMedianHomogenizationC",
      label: "Family median homogenization c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHomogenizationTemperaturesC:
        value.observedHomogenizationTemperaturesC as readonly number[],
      callerVerifiedInclusionFamilyFlags:
        value.callerVerifiedInclusionFamilyFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
