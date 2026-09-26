import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  primaryVoltage: number;
  secondaryTurns: number;
  primaryTurns: number;
  sameDottedReference: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "primaryVoltage", label: "Primary voltage", kind: "number" },
  { id: "secondaryTurns", label: "Secondary turns", kind: "integer" },
  { id: "primaryTurns", label: "Primary turns", kind: "integer" },
  {
    id: "sameDottedReference",
    label: "Same dotted reference",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.primaryTurns, 1, 1000000);
  H.int(i.secondaryTurns, 1, 1000000);
  return H.finish({
    secondaryVoltage:
      ((i.sameDottedReference ? 1 : -1) * i.primaryVoltage * i.secondaryTurns) /
      i.primaryTurns,
  });
};
export const example = {
  input: {
    primaryVoltage: 10,
    secondaryTurns: 2,
    primaryTurns: 4,
    sameDottedReference: false,
  },
  output: { result: { secondaryVoltage: -5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/transformer-turns-polarity-sign",
  title: "Electricity: Transformer Turns Polarity Sign Tool",
  description:
    "Apply an ideal transformer turns ratio with an explicit common/opposed dotted voltage-reference orientation; not a winding safety or saturation model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { secondaryVoltage: { type: "number" } },
        required: ["secondaryVoltage"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
