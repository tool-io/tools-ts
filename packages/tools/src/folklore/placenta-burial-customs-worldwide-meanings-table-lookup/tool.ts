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
          "Placenta-related burial customs are community-specific and can carry familial, land or spiritual meanings.",
        reference:
          "Community-specific ethnographic and cultural interpretation.",
        limitations:
          "Description only, no biological handling, burial permission or medical safety guidance.",
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
      text: "Placenta-related burial customs are community-specific and can carry familial, land or spiritual meanings.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/placenta-burial-customs-worldwide-meanings-table-lookup",
  title: "Placenta Burial Customs Worldwide Meanings Table Lookup",
  description:
    "Bounded offline reference: Placenta-related burial customs are community-specific and can carry familial, land or spiritual meanings. Source: Community-specific ethnographic and cultural interpretation. Description only, no biological handling, burial permission or medical safety guidance. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
