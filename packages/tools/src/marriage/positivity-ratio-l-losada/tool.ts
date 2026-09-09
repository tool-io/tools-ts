import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch48-shared.js";
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
          "The purported universal Losadacritical positivity ratio is not a scientifically valid nonlinear-dynamics threshold.",
        reference:
          "Brown, SokalandFriedman2013critical positivity ratio analysis, AmericanPsychologist68:801\u2013813.",
        limitations:
          "Do not use2.9013or another universal ratio to classify flourishing, marital success or treatment need.",
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
      text: "The purported universal Losadacritical positivity ratio is not a scientifically valid nonlinear-dynamics threshold.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/positivity-ratio-l-losada",
  title: "Positivity Ratio L losada Calculator",
  description:
    "Bounded offline reference: The purported universal Losadacritical positivity ratio is not a scientifically valid nonlinear-dynamics threshold. Source: Brown, SokalandFriedman2013critical positivity ratio analysis, AmericanPsychologist68:801\u2013813. Do not use2.9013or another universal ratio to classify flourishing, marital success or treatment need. Topic keys: summary, reference, limitations. Not a complete/current reference corpus, individual outcome, legal/design compliance or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
