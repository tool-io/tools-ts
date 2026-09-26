import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  mutualInductance: number;
  currentSlope: number;
  currentEntersDot: boolean;
  voltageMeasuredDotPositive: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mutualInductance", label: "Mutual inductance", kind: "number" },
  { id: "currentSlope", label: "Current slope", kind: "number" },
  { id: "currentEntersDot", label: "Current enters dot", kind: "boolean" },
  {
    id: "voltageMeasuredDotPositive",
    label: "Voltage measured dot positive",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.mutualInductance >= 0);
  return H.finish({
    inducedVoltage:
      (i.currentEntersDot === i.voltageMeasuredDotPositive ? 1 : -1) *
      i.mutualInductance *
      i.currentSlope,
  });
};
export const example = {
  input: {
    mutualInductance: 2,
    currentSlope: 3,
    currentEntersDot: true,
    voltageMeasuredDotPositive: false,
  },
  output: { result: { inducedVoltage: -6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/inductor-mutual-dot-sign",
  title: "Electricity: Inductor Mutual Dot Sign Tool",
  description:
    "Apply the ideal mutual-inductance dot-convention sign to one supplied current derivative and voltage-reference orientation; not a coupled-circuit solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { inducedVoltage: { type: "number" } },
        required: ["inducedVoltage"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
