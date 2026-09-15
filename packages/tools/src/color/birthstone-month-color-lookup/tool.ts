import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly month: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "month", label: "Month", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.month,
      {
        "1": "garnet: commonly deep red",
        "2": "amethyst: purple",
        "3": "aquamarine: pale blue",
        "4": "diamond: commonly colorless",
        "5": "emerald: green",
        "6": "pearl: commonly white/cream",
        "7": "ruby: red",
        "8": "peridot: yellow-green",
        "9": "sapphire: commonly blue",
        "10": "opal: variable play of color",
        "11": "topaz: variable, commonly yellow/orange",
        "12": "turquoise: blue-green",
      },
      "month",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { month: "5" },
  output: { result: { reference: "emerald: green" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/birthstone-month-color-lookup",
  title: "Birthstone Month Color Lookup",
  description:
    "One illustrative modern birthstone per month, not exhaustive or gem-authentication data; alternative traditions vary.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
