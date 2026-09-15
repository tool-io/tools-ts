import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{ readonly statuteMiles: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "statuteMiles", label: "Statute miles", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.statuteMiles, "visibility");
  return { reportedDistanceMeters: i.statuteMiles * 1609.344 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { statuteMiles: 1 },
  output: { result: { reportedDistanceMeters: 1609.344 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/runway-prevailing-visibility-mile-conversion",
  title: "Runway Prevailing Visibility Mile Converter",
  description:
    "Statute-mile visibility reporting distance to meters; does not convert prevailing visibility into runway visual range or authorize flight.",
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
