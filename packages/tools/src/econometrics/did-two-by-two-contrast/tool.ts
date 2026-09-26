import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  treatedBefore: number;
  treatedAfter: number;
  controlBefore: number;
  controlAfter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "treatedBefore", label: "Treated before", kind: "number" },
  { id: "treatedAfter", label: "Treated after", kind: "number" },
  { id: "controlBefore", label: "Control before", kind: "number" },
  { id: "controlAfter", label: "Control after", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    treatedChange: i.treatedAfter - i.treatedBefore,
    controlChange: i.controlAfter - i.controlBefore,
    differenceInDifferences:
      i.treatedAfter - i.treatedBefore - i.controlAfter + i.controlBefore,
  });
};
export const example = {
  input: {
    treatedBefore: 10,
    treatedAfter: 15,
    controlBefore: 8,
    controlAfter: 10,
  },
  output: {
    result: { treatedChange: 5, controlChange: 2, differenceInDifferences: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "econometrics/did-two-by-two-contrast",
  title: "Econometrics: Difference-in-Differences Two By Two Contrast Tool",
  description:
    "Compute the descriptive two-by-two difference-in-differences contrast from explicit cell means; no causal identification, parallel-trends claim or uncertainty estimation.",
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
          controlChange: { type: "number" },
          differenceInDifferences: { type: "number" },
          treatedChange: { type: "number" },
        },
        required: ["controlChange", "differenceInDifferences", "treatedChange"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
