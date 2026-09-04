import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly columnVerticalLoadN: number;
  readonly independentlyExcludedInteriorLoadN: number;
  readonly callerCriticalPerimeterM: number;
  readonly effectiveSlabDepthM: number;
}>;
export type Output = Readonly<{ readonly netPunchingDemandPa: number }>;
const inputFields = [
  {
    id: "columnVerticalLoadN",
    label: "Column vertical load n",
    kind: "number",
  },
  {
    id: "independentlyExcludedInteriorLoadN",
    label: "Independently excluded interior load n",
    kind: "number",
  },
  {
    id: "callerCriticalPerimeterM",
    label: "Caller critical perimeter m",
    kind: "number",
  },
  {
    id: "effectiveSlabDepthM",
    label: "Effective slab depth m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCriticalPerimeterM, "callerCriticalPerimeterM");
  positive(input.effectiveSlabDepthM, "effectiveSlabDepthM");
  nonnegative(input.columnVerticalLoadN, "columnVerticalLoadN");
  nonnegative(
    input.independentlyExcludedInteriorLoadN,
    "independentlyExcludedInteriorLoadN",
  );
  return {
    netPunchingDemandPa:
      (input.columnVerticalLoadN - input.independentlyExcludedInteriorLoadN) /
      (input.callerCriticalPerimeterM * input.effectiveSlabDepthM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  columnVerticalLoadN: 100,
  independentlyExcludedInteriorLoadN: 20,
  callerCriticalPerimeterM: 4,
  effectiveSlabDepthM: 0.2,
} satisfies Input;
export const exampleOutput = { netPunchingDemandPa: 100 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/punching-shear-slab",
  title: "Punching Shear Slab Calculator",
  description:
    "Audit column net shear after independent inside-perimeter loading; critical perimeter/code factors not selected. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "netPunchingDemandPa",
      label: "Net punching demand pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      columnVerticalLoadN: value.columnVerticalLoadN as number,
      independentlyExcludedInteriorLoadN:
        value.independentlyExcludedInteriorLoadN as number,
      callerCriticalPerimeterM: value.callerCriticalPerimeterM as number,
      effectiveSlabDepthM: value.effectiveSlabDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
