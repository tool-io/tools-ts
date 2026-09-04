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
          "Sasquatch/Bigfoot narratives involve modern sightings and distinct Indigenous names/accounts that must not be collapsed.",
        reference:
          "Community-specific Indigenous interpretation; North American folklore scholarship.",
        limitations:
          "No universal Indigenous belief, proven creature or permission to disclose restricted knowledge.",
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
      text: "Sasquatch/Bigfoot narratives involve modern sightings and distinct Indigenous names/accounts that must not be collapsed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/bigfoot-sasquatch-indigenous-names-behavior-lore-lookup",
  title: "Bigfoot Sasquatch Indigenous Names Behavior Lore Lookup",
  description:
    "Bounded offline reference: Sasquatch/Bigfoot narratives involve modern sightings and distinct Indigenous names/accounts that must not be collapsed. Source: Community-specific Indigenous interpretation; North American folklore scholarship. No universal Indigenous belief, proven creature or permission to disclose restricted knowledge. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
