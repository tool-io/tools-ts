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
          "Sewer-alligator stories combine occasional real urban animal incidents with embellished migratory legends.",
        reference: "Brunvand, Encyclopedia of Urban Legends.",
        limitations:
          "One documented animal does not verify a permanent breeding sewer population or every retelling.",
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
      text: "Sewer-alligator stories combine occasional real urban animal incidents with embellished migratory legends.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/alligators-in-nyc-sewers-legend-status-lookup",
  title: "Alligators in Nyc Sewers Legend Status Lookup",
  description:
    "Bounded offline reference: Sewer-alligator stories combine occasional real urban animal incidents with embellished migratory legends. Source: Brunvand, Encyclopedia of Urban Legends. One documented animal does not verify a permanent breeding sewer population or every retelling. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
