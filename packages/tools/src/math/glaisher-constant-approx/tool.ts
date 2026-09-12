import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch49-shared.js";
export type Input = Readonly<{ readonly decimalPlaces: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "decimalPlaces", label: "Decimal places", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.decimalPlaces, "decimalPlaces", 0, 1000000);
  bounded(input.decimalPlaces, "decimals", 0, 12);
  return { value: Number((1.282427129100623).toFixed(input.decimalPlaces)) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { decimalPlaces: 6 },
  output: { result: { value: 1.282427 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/glaisher-constant-approx",
  title: "Glaisher Constant Approximation",
  description:
    "Glaisher\u2013KinkelinconstantA\u22481.282427129100623. Return a bounded rounded binary64 published decimal approximation, not arbitrary precision or truncation series/error bound;0\u201312decimal places.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
