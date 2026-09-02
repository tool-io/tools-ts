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
          "Ancient visitors recorded dawn sounds at the northern Colossus of Memnon; later repairs are associated with their cessation.",
        reference: "Strabo 17.1.46; Pausanias 1.42; statue inscriptions.",
        limitations:
          "Thermal/fracture explanations are hypotheses; the historical sound is not proof of a divine voice or a reproducible mechanism.",
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
      text: "Ancient visitors recorded dawn sounds at the northern Colossus of Memnon; later repairs are associated with their cessation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/colossus-of-memnon-dawn-sound-singing-statue-phenomenon",
  title: "Colossus of Memnon Dawn Sound Singing Statue Phenomenon",
  description:
    "Bounded offline reference: Ancient visitors recorded dawn sounds at the northern Colossus of Memnon; later repairs are associated with their cessation. Source: Strabo 17.1.46; Pausanias 1.42; statue inscriptions. Thermal/fracture explanations are hypotheses; the historical sound is not proof of a divine voice or a reproducible mechanism. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
