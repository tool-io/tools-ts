import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rowValues: readonly number[];
  readonly publishedTotal: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly computedTotal: number;
  readonly difference: number;
  readonly matchesWithinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  const computedTotal = input.rowValues.reduce(
    (total, value) => total + value,
    0,
  );
  const difference = computedTotal - input.publishedTotal;
  return {
    computedTotal,
    difference,
    matchesWithinTolerance: Math.abs(difference) <= input.tolerance,
  };
};

export const exampleInput = {
  rowValues: [10, 20, 30],
  publishedTotal: 60,
  tolerance: 0,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  rowValues: [],
  publishedTotal: 0,
  tolerance: 0,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rowValues: input.rowValues as readonly number[],
      publishedTotal: input.publishedTotal as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Sum supplied table rows and compare the result with a published total.",
  id: "journalism/table-total-check",
  inputs: [
    { id: "rowValues", label: "Table row values", kind: "numberList" },
    { id: "publishedTotal", label: "Published total", kind: "number" },
    {
      id: "tolerance",
      label: "Allowed difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "computedTotal", label: "Computed total", kind: "number" },
    { id: "difference", label: "Computed minus published", kind: "number" },
    {
      id: "matchesWithinTolerance",
      label: "Matches within tolerance",
      kind: "boolean",
    },
  ],
  title: "Table Total Check",
});

export const run = tool.execute;
export default tool;
