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
          "Magnetite morphology/chain alignment can be evidence relevant to magnetotaxis but similar mineral structures may have abiotic or altered origins.",
        reference: "ALH 84001 magnetite/biogenicity debate literature.",
        limitations:
          "Morphology alone does not prove fossil life or resolve the meteorites origin history.",
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
      text: "Magnetite morphology/chain alignment can be evidence relevant to magnetotaxis but similar mineral structures may have abiotic or altered origins.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/magnetofossil-chain-alignment-flag",
  title: "ALH84001-like Magnetofossil Chain Alignment Morphology Flag",
  description:
    "Bounded offline reference: Magnetite morphology/chain alignment can be evidence relevant to magnetotaxis but similar mineral structures may have abiotic or altered origins. Source: ALH 84001 magnetite/biogenicity debate literature. Morphology alone does not prove fossil life or resolve the meteorites origin history. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
