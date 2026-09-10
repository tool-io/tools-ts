import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualEpikarstFootprintSquareMeters: number;
  readonly callerIndependentEffectiveStorageThicknessMeters: number;
  readonly callerIndependentDrainablePorosityFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEpikarstFootprintSquareMeters",
    label: "Actual epikarst footprint square meters",
    kind: "number",
  },
  {
    id: "callerIndependentEffectiveStorageThicknessMeters",
    label: "Caller independent effective storage thickness meters",
    kind: "number",
  },
  {
    id: "callerIndependentDrainablePorosityFraction",
    label: "Caller independent drainable porosity fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualEpikarstFootprintSquareMeters, "area");
  nonnegative(
    input.callerIndependentEffectiveStorageThicknessMeters,
    "thickness",
  );
  fraction(input.callerIndependentDrainablePorosityFraction, "drainable");
  return {
    conditionalEpikarstDrainableStorageCubicMeters:
      input.actualEpikarstFootprintSquareMeters *
      input.callerIndependentEffectiveStorageThicknessMeters *
      input.callerIndependentDrainablePorosityFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEpikarstFootprintSquareMeters: 10,
    callerIndependentEffectiveStorageThicknessMeters: 2,
    callerIndependentDrainablePorosityFraction: 0.1,
  },
  output: { result: { conditionalEpikarstDrainableStorageCubicMeters: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/epikarst-storage-estimate",
  title: "Epikarst Storage Estimate Calculator",
  description:
    "Actual epikarst area\u00d7independently resolved effective storage thickness\u00d7drainable porosity. Not total porevolume, infiltration kinetics or guaranteed water resource.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
