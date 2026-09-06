import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch45-shared.js";
export type Input = Readonly<{ readonly denarii: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "denarii", label: "Denarii", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.denarii, "amount");
  return { nominalSubunits: input.denarii * 4 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { denarii: 2 },
  output: { result: { nominalSubunits: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/denarius-to-sestertius-conversion-lookup",
  title: "Denarius to Sestertius Conversion Lookup",
  description:
    "Conventional Roman imperial account relationship:one denarius=four sestertii. Historical account arithmetic for caller independently applicable era/standard, not metal-mass equality, modern legal exchange, purchasing power or an invariant across all eras.",
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
