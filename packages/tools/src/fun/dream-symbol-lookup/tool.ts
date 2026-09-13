import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch51-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        limitations:
          "Dream symbols have context-dependent personal meanings; this tool does not diagnose mental conditions or predict future events.",
        prompt:
          "For a fictional story, choose a symbol and describe what it means to an invented character. This is creative reflection, not evidence about a real person.",
      },
      "topic",
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
  input: { topic: "limitations" },
  output: {
    result: {
      text: "Dream symbols have context-dependent personal meanings; this tool does not diagnose mental conditions or predict future events.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/dream-symbol-lookup",
  title: "Dream Symbol Lookup Fun",
  description:
    "Bounded offline reference: fictional Dream Symbol Lookup Fun reflection/premisecorrection. Only explicit listed topics;not exhaustive/live data or diagnosis,safety/compliance/identity certificate.",
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
