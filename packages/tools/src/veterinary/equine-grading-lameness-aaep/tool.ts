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
    enum: ["0", "1", "2", "3", "4", "5"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        "0": "Lameness not perceptible under assessed circumstances.",
        "1": "Difficult to observe and not consistently apparent regardless of circumstances.",
        "2": "Difficult to observe at walk/trot straight but consistently apparent under certain circumstances.",
        "3": "Consistently observable at trot under all circumstances.",
        "4": "Obvious at walk.",
        "5": "Minimal weight bearing at motion/rest or inability to move.",
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
  input: { topic: "0" },
  output: {
    result: { text: "Lameness not perceptible under assessed circumstances." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/equine-grading-lameness-aaep",
  title: "AAEP Equine Lameness Grade Lookup",
  description:
    "Bounded offline reference: AAEPlameness grades0\u20135are ordinal clinical descriptors, not a direct linear measurement of tissue injury. Source: AAEPlameness scale. No automatic gait diagnosis, localization or permission to exercise a lame horse. Explicit topic keys: 0, 1, 2, 3, 4, 5. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
