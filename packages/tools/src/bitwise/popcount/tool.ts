import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualNonnegativeSafeInteger: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualNonnegativeSafeInteger",
    label: "Actual nonnegative safe integer",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (
    !Number.isSafeInteger(input.actualNonnegativeSafeInteger) ||
    input.actualNonnegativeSafeInteger < 0
  )
    simpleError("integer", "ActualnonnegativeSAFEinteger.");
  let n = BigInt(input.actualNonnegativeSafeInteger),
    count = 0;
  while (n) {
    n &= n - 1n;
    count++;
  }
  return { populationCount: count };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualNonnegativeSafeInteger: 1099511627777 },
  output: { result: { populationCount: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/popcount",
  title: "Population Count Calculator",
  description:
    "Full53bitBigIntpopulationcountnot32bitbitwise truncation. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { populationCount: { type: "number" } },
        required: ["populationCount"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
