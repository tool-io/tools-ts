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
          "T\u00edr na n\u00d3g names a land-of-youth otherworld in particular Irish traditions; thin places is a distinct widely circulated expression.",
        reference:
          "Irish Ois\u00edn otherworld narrative tradition; \u00d3 h\u00d3g\u00e1in, Irish mythology scholarship.",
        limitations:
          "Do not collapse all Celtic cultures or present modern phrasing as a uniform ancient doctrine.",
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
      text: "T\u00edr na n\u00d3g names a land-of-youth otherworld in particular Irish traditions; thin places is a distinct widely circulated expression.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/celtic-tir-na-nog-otherworld-thin-places-concept-lookup",
  title: "Celtic Tir Na Nog Otherworld Thin Places Concept Lookup",
  description:
    "Bounded offline reference: T\u00edr na n\u00d3g names a land-of-youth otherworld in particular Irish traditions; thin places is a distinct widely circulated expression. Source: Irish Ois\u00edn otherworld narrative tradition; \u00d3 h\u00d3g\u00e1in, Irish mythology scholarship. Do not collapse all Celtic cultures or present modern phrasing as a uniform ancient doctrine. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
