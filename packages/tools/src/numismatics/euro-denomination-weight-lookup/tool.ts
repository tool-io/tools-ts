import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly denomination: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "denomination", label: "Denomination", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    massGrams: Number(
      pick(
        input.denomination,
        {
          "1cent": "2.30",
          "2cent": "3.06",
          "5cent": "3.92",
          "10cent": "4.10",
          "20cent": "5.74",
          "50cent": "7.80",
          "1euro": "7.50",
          "2euro": "8.50",
        },
        "denomination",
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { denomination: "2euro" },
  output: { result: { massGrams: 8.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/euro-denomination-weight-lookup",
  title: "Euro Denomination Weight Lookup",
  description:
    "Bounded nominal euro circulation coin mass reference in grams for eight denominations. ECB, technical specifications. Not measured tolerance, proof of composition or coin authentication.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
