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
          "The 2017 TCJA changed individual/business tax provisions with differing effective dates and sunset arrangements.",
        reference:
          "US Public Law115-97; Congressional Research Service TCJA summaries.",
        limitations:
          "Bounded historical map, not a complete current 2026 tax code or promise that original sunsets still apply.",
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
      text: "The 2017 TCJA changed individual/business tax provisions with differing effective dates and sunset arrangements.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/tcja-2017-major-changes-summary-map-lookup",
  title: "TCJA 2017 Major Changes Summary Map Lookup",
  description:
    "Bounded offline reference: The 2017 TCJA changed individual/business tax provisions with differing effective dates and sunset arrangements. Source: US Public Law115-97; Congressional Research Service TCJA summaries. Bounded historical map, not a complete current 2026 tax code or promise that original sunsets still apply. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
