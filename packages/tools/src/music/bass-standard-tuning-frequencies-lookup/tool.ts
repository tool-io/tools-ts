import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly strings: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "strings", label: "Strings", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.strings,
      {
        "4-E1-A1-D2-G2": [
          41.20344461410875, 55, 73.41619197935188, 97.99885899543733,
        ],
        "5-B0-E1-A1-D2-G2": [
          30.86770632850775, 41.20344461410875, 55, 73.41619197935188,
          97.99885899543733,
        ],
      },
      "strings",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { strings: "4-E1-A1-D2-G2" },
  output: {
    result: {
      reference: [41.20344461410875, 55, 73.41619197935188, 97.99885899543733],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/bass-standard-tuning-frequencies-lookup",
  title: "Bass Standard Tuning Frequencies Lookup",
  description:
    "Bounded standard four/five string bass A4=440Hz equal-tempered open tunings.",
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
