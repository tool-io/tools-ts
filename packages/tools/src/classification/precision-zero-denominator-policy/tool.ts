import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  truePositive: number;
  falsePositive: number;
  zeroPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "truePositive", label: "True positive", kind: "integer" },
  { id: "falsePositive", label: "False positive", kind: "integer" },
  {
    id: "zeroPolicy",
    label: "Zero policy",
    kind: "string",
    enum: ["zero", "one"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.truePositive, 0, 1000000);
  H.int(i.falsePositive, 0, 1000000);
  H.choice(i.zeroPolicy, ["zero", "one"]);
  const den = i.truePositive + i.falsePositive;
  return H.finish({
    defined: den !== 0,
    precision:
      den !== 0 ? i.truePositive / den : i.zeroPolicy === "one" ? 1 : 0,
  });
};
export const example = {
  input: { truePositive: 0, falsePositive: 0, zeroPolicy: "zero" },
  output: { result: { defined: false, precision: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/precision-zero-denominator-policy",
  title: "Classification: Precision Zero Denominator Policy Tool",
  description:
    "Compute precision with an explicit zero/one undefined-denominator display convention while retaining a separate defined flag.",
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
          defined: { type: "boolean" },
          precision: { type: "number" },
        },
        required: ["defined", "precision"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
