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
          "The 1934 Loch Ness surgeons photograph was later exposed through accounts of a staged model image.",
        reference: "Martin and Boyd, Nessies Little Secret.",
        limitations:
          "This photograph does not authenticate the monster or resolve every other sighting claim.",
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
      text: "The 1934 Loch Ness surgeons photograph was later exposed through accounts of a staged model image.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/loch-ness-surgeon-photo-verdict-sightings-history",
  title: "Loch Ness Surgeon Photo Verdict Sightings History",
  description:
    "Bounded offline reference: The 1934 Loch Ness surgeons photograph was later exposed through accounts of a staged model image. Source: Martin and Boyd, Nessies Little Secret. This photograph does not authenticate the monster or resolve every other sighting claim. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
