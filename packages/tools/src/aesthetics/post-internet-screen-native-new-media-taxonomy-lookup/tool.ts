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
          "Post-internet art reflects conditions shaped by networked culture and can include offline objects, not only screen-native media.",
        reference:
          "Post-internet art criticism, including Artie Vierkant 2010.",
        limitations:
          "A historically variable critical label, not a file-format or technology-only taxonomy.",
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
      text: "Post-internet art reflects conditions shaped by networked culture and can include offline objects, not only screen-native media.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/post-internet-screen-native-new-media-taxonomy-lookup",
  title: "Post Internet Screen Native New Media Taxonomy Lookup",
  description:
    "Bounded offline reference: Post-internet art reflects conditions shaped by networked culture and can include offline objects, not only screen-native media. Source: Post-internet art criticism, including Artie Vierkant 2010. A historically variable critical label, not a file-format or technology-only taxonomy. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
