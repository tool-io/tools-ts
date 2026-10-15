import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch51-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return {
    text: pick(
      input.topic,
      {
        ace: "Optional non-drinking variant: everyone taps the table once; skipping is allowed.",
        king: "Optional non-drinking variant: invent a new word rule; no communal alcohol or forced drinking.",
        queen:
          "Optional non-drinking variant: ask a harmless question; participation is consensual.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { topic: "ace" },
  output: {
    result: {
      text: "Optional non-drinking variant: everyone taps the table once; skipping is allowed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/kings-cup-rules",
  title: "Kings Cup Card Rule Lookup",
  description:
    "Bounded offline reference: ThreeexplicitoriginalKingsCup-stylealcohol-freevariants,not universal house rules. Only explicit listed topics;not exhaustive/live data or diagnosis,safety/compliance/identity certificate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
