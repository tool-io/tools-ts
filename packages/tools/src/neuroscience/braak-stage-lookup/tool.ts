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
    enum: ["I\u2013II", "III\u2013IV", "V\u2013VI"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        "I\u2013II":
          "Transentorhinal/entorhinal early distribution under the cited staging framework.",
        "III\u2013IV": "Limbic extension under the cited framework.",
        "V\u2013VI":
          "Extensive neocortical involvement under the cited framework.",
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
  input: { topic: "I\u2013II" },
  output: {
    result: {
      text: "Transentorhinal/entorhinal early distribution under the cited staging framework.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/braak-stage-lookup",
  title: "Braak Stage Lookup",
  description:
    "Bounded offline reference: Braakneurofibrillary staging describes a neuropathological regional distribution of tau-related changes. Source: Braakand Braak 1991. No diagnosis or stage assignment from a region name alone; other staging frameworks differ. Explicit topic keys: I\u2013II, III\u2013IV, V\u2013VI. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
