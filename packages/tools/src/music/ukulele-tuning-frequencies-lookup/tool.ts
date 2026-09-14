import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly tuning: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tuning", label: "Tuning", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.tuning,
      {
        "standard-reentrant-G4-C4-E4-A4": [
          391.99543598174927, 261.6255653005986, 329.6275569128699, 440,
        ],
        "standard-low-G3-C4-E4-A4": [
          195.99771799087463, 261.6255653005986, 329.6275569128699, 440,
        ],
      },
      "tuning",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { tuning: "standard-reentrant-G4-C4-E4-A4" },
  output: {
    result: {
      reference: [
        391.99543598174927, 261.6255653005986, 329.6275569128699, 440,
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/ukulele-tuning-frequencies-lookup",
  title: "Ukulele Tuning Frequencies Lookup",
  description:
    "Bounded standard soprano/concert/tenor ukulele equal-tempered A4=440Hz tunings; baritone excluded.",
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
