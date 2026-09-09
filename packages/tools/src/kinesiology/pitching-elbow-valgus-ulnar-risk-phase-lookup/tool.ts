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
          "Pitching valgus loading varies across late cocking/acceleration and depends on timing definitions, kinematics and measurement models.",
        reference: "Baseball pitching biomechanics literature.",
        limitations:
          "A phase label alone does not establish individual ulnar injury risk or safe pitching load.",
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
      text: "Pitching valgus loading varies across late cocking/acceleration and depends on timing definitions, kinematics and measurement models.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/pitching-elbow-valgus-ulnar-risk-phase-lookup",
  title: "Pitching Elbow Valgus Ulnar Risk Phase Lookup",
  description:
    "Bounded offline reference: Pitching valgus loading varies across late cocking/acceleration and depends on timing definitions, kinematics and measurement models. Source: Baseball pitching biomechanics literature. A phase label alone does not establish individual ulnar injury risk or safe pitching load. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
