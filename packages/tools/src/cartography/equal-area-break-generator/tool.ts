import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, areaBreaks } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedValues: readonly number[];
  readonly actualFeatureAreas: readonly number[];
  readonly classes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedValues", label: "Observed values", kind: "numberList" },
  {
    id: "actualFeatureAreas",
    label: "Actual feature areas",
    kind: "numberList",
  },
  { id: "classes", label: "Classes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return areaBreaks(i.observedValues, i.actualFeatureAreas, i.classes);
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    observedValues: [1, 2, 3],
    actualFeatureAreas: [1, 1, 2],
    classes: 2,
  },
  output: { result: { upperBounds: [2, 3], totalArea: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/equal-area-break-generator",
  title: "Equal Area Class Break Generator",
  description:
    "Cumulative feature-area weighted class upper boundaries; indivisible features and tied values cannot guarantee equal physical areas.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
