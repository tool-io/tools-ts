import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualName: string;
  readonly actualCodepointLimit: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualName", label: "Actual name", kind: "string" },
  {
    id: "actualCodepointLimit",
    label: "Actual codepoint limit",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualCodepointLimit, "limit", 1, 128);
  return {
    convertedText: Array.from(input.actualName)
      .slice(0, input.actualCodepointLimit)
      .join(""),
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
  input: { actualName: "Juniper", actualCodepointLimit: 3 },
  output: { result: { convertedText: "Jun" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/nickname-shortener",
  title: "Nickname Shortener Fun",
  description:
    "Caller-chosennicknamecodepointprefixlimit,not linguisticshortform Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
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
