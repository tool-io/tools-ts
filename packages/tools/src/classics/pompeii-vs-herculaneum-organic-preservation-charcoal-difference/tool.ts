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
          "Pompeii and Herculaneum experienced differing burial/thermal conditions in 79 CE, with exceptional but uneven preservation.",
        reference: "Archaeological park research; Vesuvian eruption studies.",
        limitations:
          "Herculaneum organic material often carbonized; not every object is intact or one uniform preservation mechanism.",
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
      text: "Pompeii and Herculaneum experienced differing burial/thermal conditions in 79 CE, with exceptional but uneven preservation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/pompeii-vs-herculaneum-organic-preservation-charcoal-difference",
  title: "Pompeii vs Herculaneum Organic Preservation Charcoal Difference",
  description:
    "Bounded offline reference: Pompeii and Herculaneum experienced differing burial/thermal conditions in 79 CE, with exceptional but uneven preservation. Source: Archaeological park research; Vesuvian eruption studies. Herculaneum organic material often carbonized; not every object is intact or one uniform preservation mechanism. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
