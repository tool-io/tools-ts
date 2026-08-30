import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly absorbedRfEnergiesJ: readonly number[];
  readonly averagingWindowSeconds: number;
  readonly exposedMassKg: number;
  readonly comparisonLevelWattsPerKg: number;
}>;
export type Output = Readonly<{
  readonly averageSarWattsPerKg: number;
  readonly exceedsComparisonLevel: boolean;
}>;
const inputFields = [
  {
    id: "absorbedRfEnergiesJ",
    label: "Absorbed rf energies j",
    kind: "numberList",
  },
  {
    id: "averagingWindowSeconds",
    label: "Averaging window seconds",
    kind: "number",
    unit: "s",
  },
  { id: "exposedMassKg", label: "Exposed mass kg", kind: "number", unit: "kg" },
  {
    id: "comparisonLevelWattsPerKg",
    label: "Comparison level watts per kg",
    kind: "number",
    unit: "kg",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.absorbedRfEnergiesJ.length)
    simpleError(
      "absorbedRfEnergiesJ",
      "Nonempty absorbed-energy segments required.",
    );
  input.absorbedRfEnergiesJ.forEach((v) =>
    nonnegative(v, "absorbedRfEnergiesJ"),
  );
  positive(input.averagingWindowSeconds, "averagingWindowSeconds");
  positive(input.exposedMassKg, "exposedMassKg");
  positive(input.comparisonLevelWattsPerKg, "comparisonLevelWattsPerKg");
  const averageSarWattsPerKg =
    input.absorbedRfEnergiesJ.reduce((a, b) => a + b, 0) /
    (input.averagingWindowSeconds * input.exposedMassKg);
  return {
    averageSarWattsPerKg,
    exceedsComparisonLevel:
      averageSarWattsPerKg > input.comparisonLevelWattsPerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  absorbedRfEnergiesJ: [10, 20],
  averagingWindowSeconds: 10,
  exposedMassKg: 5,
  comparisonLevelWattsPerKg: 1,
} satisfies Input;
export const exampleOutput = {
  averageSarWattsPerKg: 0.6,
  exceedsComparisonLevel: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/rf-energy-average-sar",
  title: "Specific Absorption Rate SAR",
  description:
    "Summarize supplied absorbed RF energy over an explicit time window and mass; a caller comparison level is not a scanner safety certification or regulatory recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "averageSarWattsPerKg",
      label: "Average sar watts per kg",
      kind: "number",
      unit: "kg",
    },
    {
      id: "exceedsComparisonLevel",
      label: "Exceeds comparison level",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      absorbedRfEnergiesJ: value.absorbedRfEnergiesJ as readonly number[],
      averagingWindowSeconds: value.averagingWindowSeconds as number,
      exposedMassKg: value.exposedMassKg as number,
      comparisonLevelWattsPerKg: value.comparisonLevelWattsPerKg as number,
    }),
});
export const run = tool.execute;
export default tool;
