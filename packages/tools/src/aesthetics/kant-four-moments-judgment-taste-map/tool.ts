import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: [
      "summary",
      "reference",
      "limitations",
      "quality",
      "quantity",
      "relation",
      "modality",
    ],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        quality:
          "Disinterested pleasure distinguishes the judgment of taste from desire for possession or practical use.",
        quantity:
          "The judgment claims universal communicability without determining the object through a concept.",
        relation:
          "The object is judged through purposiveness without a represented determinate purpose.",
        modality:
          "The judgment claims exemplary necessity grounded in a presupposed common sense, not a proof binding every observer.",
        summary:
          "Kants four moments organize judgments of taste by quality, quantity, relation and modality.",
        reference: "Kant, Critique of Judgment, sections1\u201322.",
        limitations: "Interpretive map, not a universal beauty score.",
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
      text: "Kants four moments organize judgments of taste by quality, quantity, relation and modality.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/kant-four-moments-judgment-taste-map",
  title: "Kant Four Moments Judgment Taste Map",
  description:
    "Bounded offline reference: Kants four moments organize judgments of taste by quality, quantity, relation and modality. Source: Kant, Critique of Judgment, sections1\u201322. Interpretive map, not a universal beauty score. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
