import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFiniteNumber: number;
  readonly actualSignificantDigits: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualFiniteNumber", label: "Actual finite number", kind: "number" },
  {
    id: "actualSignificantDigits",
    label: "Actual significant digits",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(input.actualSignificantDigits, "digits", 1, 15);
  const text = input.actualFiniteNumber.toPrecision(
      input.actualSignificantDigits,
    ),
    v = Number(text);
  return { roundedValue: v, roundedSignificantText: text };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualFiniteNumber: 1234.5, actualSignificantDigits: 3 },
  output: { result: { roundedValue: 1230, roundedSignificantText: "1.23e+3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arithmetic/round-significant-figures",
  title: "Round to Significant Figures Calculator",
  description:
    "Finitebinary64number toPrecisionroundingsignificantdigits1\u201315,textretains trailingzeros;not exactdecimal monetaryrounding. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          roundedValue: { type: "number" },
          roundedSignificantText: { type: "string" },
        },
        required: ["roundedValue", "roundedSignificantText"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
