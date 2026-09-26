import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  measuredOxygenPercent: number;
  referenceOxygenPercent: number;
  airOxygenPercent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "measuredOxygenPercent",
    label: "Measured oxygen percent",
    kind: "number",
    unit: "%",
  },
  {
    id: "referenceOxygenPercent",
    label: "Reference oxygen percent",
    kind: "number",
    unit: "%",
  },
  {
    id: "airOxygenPercent",
    label: "Air oxygen percent",
    kind: "number",
    unit: "%",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.airOxygenPercent, 0, 100);
  H.check(
    i.measuredOxygenPercent >= 0 &&
      i.referenceOxygenPercent >= 0 &&
      i.measuredOxygenPercent < i.airOxygenPercent &&
      i.referenceOxygenPercent < i.airOxygenPercent,
  );
  return H.finish({
    correctionFactor:
      (i.airOxygenPercent - i.referenceOxygenPercent) /
      (i.airOxygenPercent - i.measuredOxygenPercent),
  });
};
export const example = {
  input: {
    measuredOxygenPercent: 10,
    referenceOxygenPercent: 5,
    airOxygenPercent: 21,
  },
  output: { result: { correctionFactor: 1.4545454545454546 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "environmental-engineering/stack-gas-oxygen-reference-factor",
  title: "Environmental Engineering: Stack Gas Oxygen Reference Factor Tool",
  description:
    "Compute the dry-basis stack concentration oxygen-reference factor using explicit air/reference/measured oxygen percentages; no regulatory standard or emissions compliance inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { correctionFactor: { type: "number" } },
        required: ["correctionFactor"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
