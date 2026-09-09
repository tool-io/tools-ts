import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Vernes From the Earth to the Moon locates a fictional cannon-launch scheme in Florida. Actual spacecraft rocket acceleration and trajectory differ fundamentally.",
        reference: "Verne, From the Earth to the Moon 1865.",
        limitations:
          "Geographic parallels are selective retrospective comparisons, not a viable cannon launch or scored prophecy.",
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
      text: "Vernes From the Earth to the Moon locates a fictional cannon-launch scheme in Florida. Actual spacecraft rocket acceleration and trajectory differ fundamentally.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/jules-verne-from-earth-to-moon-florida-launch-coincidence",
  title: "Jules Verne From Earth to Moon Florida Launch Coincidence",
  description:
    "Bounded offline reference: Vernes From the Earth to the Moon locates a fictional cannon-launch scheme in Florida. Actual spacecraft rocket acceleration and trajectory differ fundamentally. Source: Verne, From the Earth to the Moon 1865. Geographic parallels are selective retrospective comparisons, not a viable cannon launch or scored prophecy. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
