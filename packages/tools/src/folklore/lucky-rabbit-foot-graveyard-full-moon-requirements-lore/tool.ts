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
          "Lucky-rabbit-foot stories include region-specific provenance and timing requirements in folklore circulation.",
        reference: "Dundes and comparative superstition studies.",
        limitations:
          "No efficacy claim, animal-harm ritual or graveyard-trespass instructions.",
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
      text: "Lucky-rabbit-foot stories include region-specific provenance and timing requirements in folklore circulation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/lucky-rabbit-foot-graveyard-full-moon-requirements-lore",
  title: "Lucky Rabbit Foot Graveyard Full Moon Requirements Lore",
  description:
    "Bounded offline reference: Lucky-rabbit-foot stories include region-specific provenance and timing requirements in folklore circulation. Source: Dundes and comparative superstition studies. No efficacy claim, animal-harm ritual or graveyard-trespass instructions. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
