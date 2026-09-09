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
          "Cleat fore-aft assessment may use metatarsal landmarks with shoe, pedal and rider context explicitly recorded.",
        reference: "Cycle fitting methodology.",
        limitations:
          "No universal marker offset or individualized fit prescription from a landmark alone.",
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
      text: "Cleat fore-aft assessment may use metatarsal landmarks with shoe, pedal and rider context explicitly recorded.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/cleat-fore-aft-metatarsal-marker-method-lookup",
  title: "Cleat Fore Aft Metatarsal Marker Method Lookup",
  description:
    "Bounded offline reference: Cleat fore-aft assessment may use metatarsal landmarks with shoe, pedal and rider context explicitly recorded. Source: Cycle fitting methodology. No universal marker offset or individualized fit prescription from a landmark alone. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
