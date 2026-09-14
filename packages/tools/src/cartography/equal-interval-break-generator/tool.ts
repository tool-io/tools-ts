import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, range } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly classes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "minimumValue", label: "Minimum value", kind: "number" },
  { id: "maximumValue", label: "Maximum value", kind: "number" },
  { id: "classes", label: "Classes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  range([i.minimumValue, i.maximumValue], "extent");
  bounded(i.classes, "classes", 1, 128);
  return {
    breaks: Array.from(
      { length: i.classes + 1 },
      (_, j) =>
        i.minimumValue + ((i.maximumValue - i.minimumValue) * j) / i.classes,
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { minimumValue: -10, maximumValue: 10, classes: 2 },
  output: { result: { breaks: [-10, 0, 10] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/equal-interval-break-generator",
  title: "Equal Interval Class Break Generator",
  description:
    "Equal attribute interval boundaries; does not equalize feature counts or map areas.",
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
