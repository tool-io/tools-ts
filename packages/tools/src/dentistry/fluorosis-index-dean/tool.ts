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
    enum: ["normal", "questionable", "veryMild", "mild", "moderate", "severe"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        normal: "No fluorosis under the defined assessment.",
        questionable:
          "Minor translucency changes not conclusively characteristic.",
        veryMild:
          "Small opaque white areas over less than about25 percent of surface.",
        mild: "More extensive opaque areas but less than about50 percent.",
        moderate: "All enamel surfaces affected; wear/staining may occur.",
        severe:
          "Marked hypoplasia/pitting and widespread changes under clinical definition.",
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
  input: { topic: "normal" },
  output: { result: { text: "No fluorosis under the defined assessment." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/fluorosis-index-dean",
  title: "Dean Fluorosis Index Calculator",
  description:
    "Bounded offline reference: Dean's fluorosis categories are ordinal independently clinically assessed classifications, not a continuous linear measurement. Source: Deanfluorosis index descriptions. Community-index weighting and two-most-affected-teeth convention require actual independently qualified protocol. Explicit topic keys: normal, questionable, veryMild, mild, moderate, severe. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
