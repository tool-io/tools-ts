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
          "The British 1816 coinage reform and 1817 introduction of the modern sovereign shifted gold coinage from the guinea standard.",
        reference: "Royal Mint, Great Recoinage/sovereign histories.",
        limitations:
          "Not a claim every guinea disappeared on one day or a current guaranteed exchange arrangement.",
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
      text: "The British 1816 coinage reform and 1817 introduction of the modern sovereign shifted gold coinage from the guinea standard.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/great-recoinage-1816-guinea-sovereign-replacement",
  title: "Great Recoinage 1816 Guinea Sovereign Replacement",
  description:
    "Bounded offline reference: The British 1816 coinage reform and 1817 introduction of the modern sovereign shifted gold coinage from the guinea standard. Source: Royal Mint, Great Recoinage/sovereign histories. Not a claim every guinea disappeared on one day or a current guaranteed exchange arrangement. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
