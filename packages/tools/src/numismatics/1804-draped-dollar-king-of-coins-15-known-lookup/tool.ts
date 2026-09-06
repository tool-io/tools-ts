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
          "Fifteen 1804 dollars are conventionally recognized across specialist classes; they were made later than the date on the coin.",
        reference: "Smithsonian/1804 dollar numismatic histories.",
        limitations:
          "A conventional historical census is not a live exhaustive ownership/condition audit;1804 does not prove 1804 manufacture.",
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
      text: "Fifteen 1804 dollars are conventionally recognized across specialist classes; they were made later than the date on the coin.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/1804-draped-dollar-king-of-coins-15-known-lookup",
  title: "1804 Draped Dollar King of Coins 15 Known Lookup",
  description:
    "Bounded offline reference: Fifteen 1804 dollars are conventionally recognized across specialist classes; they were made later than the date on the coin. Source: Smithsonian/1804 dollar numismatic histories. A conventional historical census is not a live exhaustive ownership/condition audit;1804 does not prove 1804 manufacture. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
