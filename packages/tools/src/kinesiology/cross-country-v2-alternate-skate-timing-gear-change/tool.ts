import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "Cross-country V2and V2alternate skating differ in pole-thrust coordination across skating steps.",
        reference: "Nordic-ski technique descriptions.",
        limitations:
          "Technique choice depends on terrain, speed and athlete; no universal timing prescription.",
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
      text: "Cross-country V2and V2alternate skating differ in pole-thrust coordination across skating steps.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/cross-country-v2-alternate-skate-timing-gear-change",
  title: "Cross Country V2 Alternate Skate Timing Gear Change",
  description:
    "Bounded offline reference: Cross-country V2and V2alternate skating differ in pole-thrust coordination across skating steps. Source: Nordic-ski technique descriptions. Technique choice depends on terrain, speed and athlete; no universal timing prescription. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
