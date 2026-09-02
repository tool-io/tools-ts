import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "Female gladiator evidence includes a Halicarnassus relief and limited literary references; surviving evidence is sparse.",
        reference:
          "British Museum, Halicarnassus gladiator relief; Suetonius and Cassius Dio.",
        limitations:
          "Sparse attestation does not support an exact population rarity rate or every staged-fight interpretation.",
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
      text: "Female gladiator evidence includes a Halicarnassus relief and limited literary references; surviving evidence is sparse.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/gladiatrix-female-gladiators-attested-evidence-rarity-lookup",
  title: "Gladiatrix Female Gladiators Attested Evidence Rarity Lookup",
  description:
    "Bounded offline reference: Female gladiator evidence includes a Halicarnassus relief and limited literary references; surviving evidence is sparse. Source: British Museum, Halicarnassus gladiator relief; Suetonius and Cassius Dio. Sparse attestation does not support an exact population rarity rate or every staged-fight interpretation. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
