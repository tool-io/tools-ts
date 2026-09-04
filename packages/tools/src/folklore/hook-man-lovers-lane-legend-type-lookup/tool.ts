import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "The Hook is a familiar lovers-lane warning legend with multiple endings.",
        reference: "Brunvand, The Vanishing Hitchhiker.",
        limitations:
          "Plot description is not evidence of an actual attacker or location-specific threat.",
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
      text: "The Hook is a familiar lovers-lane warning legend with multiple endings.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/hook-man-lovers-lane-legend-type-lookup",
  title: "Hook Man Lovers Lane Legend Type Lookup",
  description:
    "Bounded offline reference: The Hook is a familiar lovers-lane warning legend with multiple endings. Source: Brunvand, The Vanishing Hitchhiker. Plot description is not evidence of an actual attacker or location-specific threat. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
