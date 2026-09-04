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
          "M\u0101ui narratives include varied feats in distinct Pacific communities, such as fishing up land or slowing the sun in some versions.",
        reference:
          "Community-specific M\u0101ori and Pacific M\u0101ui narrative collections.",
        limitations:
          "No universal Pacific canon; retain original community, source, language and permission.",
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
      text: "M\u0101ui narratives include varied feats in distinct Pacific communities, such as fishing up land or slowing the sun in some versions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/maui-trickster-demigod-pacific-islands-tales-lookup",
  title: "Maui Trickster Demigod Pacific Islands Tales Lookup",
  description:
    "Bounded offline reference: M\u0101ui narratives include varied feats in distinct Pacific communities, such as fishing up land or slowing the sun in some versions. Source: Community-specific M\u0101ori and Pacific M\u0101ui narrative collections. No universal Pacific canon; retain original community, source, language and permission. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
