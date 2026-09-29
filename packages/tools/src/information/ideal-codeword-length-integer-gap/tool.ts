import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ probability: number; radix: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "probability", label: "Probability", kind: "number" },
  { id: "radix", label: "Radix", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.probability > 0 && i.probability <= 1);
  H.int(i.radix, 2, 1000000);
  const ideal = -Math.log(i.probability) / Math.log(i.radix);
  return H.finish({
    idealLength: ideal,
    integerLength: Math.ceil(ideal),
    roundingGap: Math.ceil(ideal) - ideal,
  });
};
export const example = {
  input: { probability: 0.25, radix: 2 },
  output: { result: { idealLength: 2, integerLength: 2, roundingGap: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/ideal-codeword-length-integer-gap",
  title: "Information: Ideal Codeword Length Integer Gap Tool",
  description:
    "Compare an ideal radix code length with its upward integer ceiling for one symbol; no claim that individually rounded lengths form an optimal code.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          idealLength: { type: "number" },
          integerLength: { type: "number" },
          roundingGap: { type: "number" },
        },
        required: ["idealLength", "integerLength", "roundingGap"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
