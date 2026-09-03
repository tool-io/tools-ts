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
          "Josephus is the main surviving narrative source for Masadas siege and mass-death account; archaeology does not independently confirm every narrative detail.",
        reference: "Josephus, Jewish War7; Masada excavation scholarship.",
        limitations:
          "Siege date is commonly73/74 CE; no certainty about every reported speech, death or motive and no self-harm glorification.",
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
      text: "Josephus is the main surviving narrative source for Masadas siege and mass-death account; archaeology does not independently confirm every narrative detail.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/masada-73-ad-ramp-suicide-narrative-single-source-issue",
  title: "MasadaAD 73 Ramp Suicide Narrative Single Source Issue",
  description:
    "Bounded offline reference: Josephus is the main surviving narrative source for Masadas siege and mass-death account; archaeology does not independently confirm every narrative detail. Source: Josephus, Jewish War7; Masada excavation scholarship. Siege date is commonly73/74 CE; no certainty about every reported speech, death or motive and no self-harm glorification. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
