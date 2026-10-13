import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, englishInteger } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCanonicalIntegerDecimal: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualCanonicalIntegerDecimal",
    label: "Actual canonical integer decimal",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return { englishWords: englishInteger(input.actualCanonicalIntegerDecimal) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualCanonicalIntegerDecimal: "-1234" },
  output: {
    result: { englishWords: "minus one thousand two hundred thirty-four" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "convert/number-to-words",
  title: "Number to Words Converter",
  description:
    "Canonical signedintegerEnglishwordsspelling|n|<10^15,no decimals,currencygrammar,regionaland styleor unsafe numericinput. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { englishWords: { type: "string" } },
        required: ["englishWords"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
