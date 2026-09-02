import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Federal Reserve implementation uses administered rates and market operations; an ample-reserves framework differs from a scarce-reserves corridor.",
        reference: "Federal Reserve, monetary-policy implementation materials.",
        limitations:
          "No live target range or policy stance inferred; rates and framework details change.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Federal Reserve implementation uses administered rates and market operations; an ample-reserves framework differs from a scarce-reserves corridor.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/federal-funds-target-range-corridor-floor-implementation-note",
  title: "Federal Funds Target Range Corridor Floor Implementation Note",
  description:
    "Bounded offline reference: Federal Reserve implementation uses administered rates and market operations; an ample-reserves framework differs from a scarce-reserves corridor. Source: Federal Reserve, monetary-policy implementation materials. No live target range or policy stance inferred; rates and framework details change. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
