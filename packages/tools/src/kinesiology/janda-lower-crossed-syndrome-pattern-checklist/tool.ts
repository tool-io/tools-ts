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
          "Jandas lower-crossed pattern is a conceptual model of lumbopelvic muscle/control relationships, not a universal causal explanation of pain.",
        reference: "Jandamovement-system literature.",
        limitations:
          "Observed posture does not establish specific muscle pathology or authorize treatment.",
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
      text: "Jandas lower-crossed pattern is a conceptual model of lumbopelvic muscle/control relationships, not a universal causal explanation of pain.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/janda-lower-crossed-syndrome-pattern-checklist",
  title: "Janda Lower Crossed Syndrome Pattern Checklist",
  description:
    "Bounded offline reference: Jandas lower-crossed pattern is a conceptual model of lumbopelvic muscle/control relationships, not a universal causal explanation of pain. Source: Jandamovement-system literature. Observed posture does not establish specific muscle pathology or authorize treatment. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
