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
          "Valsalvabracing changes intrathoracic pressure and cardiovascular loading; suitability depends on task, training and medical context.",
        reference: "Resistance exercise/bracing physiology literature.",
        limitations:
          "No universal instruction to hold breath or clearance for people with cardiovascular/pregnancy/other risks.",
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
      text: "Valsalvabracing changes intrathoracic pressure and cardiovascular loading; suitability depends on task, training and medical context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/valsalva-maneuver-bracing-when-to-use-safety-context-lookup",
  title: "Valsalva Maneuver Bracing When to Use Safety Context Lookup",
  description:
    "Bounded offline reference: Valsalvabracing changes intrathoracic pressure and cardiovascular loading; suitability depends on task, training and medical context. Source: Resistance exercise/bracing physiology literature. No universal instruction to hold breath or clearance for people with cardiovascular/pregnancy/other risks. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
