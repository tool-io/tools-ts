import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rebarCut } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly requiredRebarCutLengthsMm: readonly number[];
  readonly commonStockBarLengthMm: number;
}>;
export type Output = Readonly<{
  readonly minimumBars: number;
  readonly cutBarIndices: readonly number[];
  readonly unallocatedStockMm: number;
}>;
const inputFields = [
  {
    id: "requiredRebarCutLengthsMm",
    label: "Required rebar cut lengths mm",
    kind: "numberList",
  },
  {
    id: "commonStockBarLengthMm",
    label: "Common stock bar length mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return rebarCut(
    input.requiredRebarCutLengthsMm,
    input.commonStockBarLengthMm,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredRebarCutLengthsMm: [6, 4, 6, 4],
  commonStockBarLengthMm: 10,
} satisfies Input;
export const exampleOutput = {
  minimumBars: 2,
  cutBarIndices: [1, 1, 0, 0],
  unallocatedStockMm: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/rebar-cut-optimization-waste",
  title: "Rebar Cut Optimization Waste Calculator",
  description:
    "EXACT subset-DP minimum equal stock bars for1–16 integer-mm rebar shear cuts, zero kerf explicitly, residual unallocated stock not necessarily scrap. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "minimumBars", label: "Minimum bars", kind: "number" },
    { id: "cutBarIndices", label: "Cut bar indices", kind: "numberList" },
    { id: "unallocatedStockMm", label: "Unallocated stock mm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      requiredRebarCutLengthsMm:
        value.requiredRebarCutLengthsMm as readonly number[],
      commonStockBarLengthMm: value.commonStockBarLengthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
