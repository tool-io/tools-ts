import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFiniteNumber: number;
  readonly actualFractionDigits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFiniteNumber", label: "Actual finite number", kind: "number" },
  {
    id: "actualFractionDigits",
    label: "Actual fraction digits",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualFractionDigits, "digits", 0, 20);
  return {
    scientificNotation: input.actualFiniteNumber.toExponential(
      input.actualFractionDigits,
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualFiniteNumber: 1234, actualFractionDigits: 2 },
  output: { result: { scientificNotation: "1.23e+3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/scientific-notation",
  title: "Scientific Notation Formatter",
  description:
    "Finitebinary64scientificnotationwithspecifieddigitsafterdecimal,not powersof10normalizationparse or arbitraryprecision. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
