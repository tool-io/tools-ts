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
          "Olympic-lift phase labels often distinguish first pull, transition/second knee bend and subsequent power-producing phases.",
        reference: "Weightlifting kinematics literature.",
        limitations:
          "Event definitions vary; no lifting technique prescription or safety approval.",
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
      text: "Olympic-lift phase labels often distinguish first pull, transition/second knee bend and subsequent power-producing phases.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/snatch-clean-first-pull-transition-power-position-phases",
  title: "Snatch Clean First Pull Transition Power Position Phases",
  description:
    "Bounded offline reference: Olympic-lift phase labels often distinguish first pull, transition/second knee bend and subsequent power-producing phases. Source: Weightlifting kinematics literature. Event definitions vary; no lifting technique prescription or safety approval. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
