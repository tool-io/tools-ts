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
    enum: ["1", "2", "3", "4", "5"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        "1": "Neocortical deposition.",
        "2": "Additional allocortical involvement.",
        "3": "Additional diencephalic/striatal and related subcortical involvement.",
        "4": "Additional brainstem involvement.",
        "5": "Additional cerebellar involvement.",
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
  input: { topic: "1" },
  output: { result: { text: "Neocortical deposition." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/thal-phase-lookup",
  title: "Thal Phase Lookup",
  description:
    "Bounded offline reference: Thalamyloid phases describe regional progression of beta-amyloid deposition in neuropathological assessment. Source: Thalet al.2002. No phase diagnosis from MRI or automatic histology classification. Explicit topic keys: 1, 2, 3, 4, 5. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
