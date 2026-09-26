import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  anodeMinusCathodeVoltage: number;
  forwardCurrent: number;
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "anodeMinusCathodeVoltage",
    label: "Anode minus cathode voltage",
    kind: "number",
  },
  { id: "forwardCurrent", label: "Forward current", kind: "number" },
  { id: "tolerance", label: "Tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.tolerance, 0, 1);
  return H.finish({
    onBranchConsistent:
      i.forwardCurrent >= -i.tolerance &&
      Math.abs(i.anodeMinusCathodeVoltage) <= i.tolerance,
    offBranchConsistent:
      Math.abs(i.forwardCurrent) <= i.tolerance &&
      i.anodeMinusCathodeVoltage <= i.tolerance,
  });
};
export const example = {
  input: { anodeMinusCathodeVoltage: 0, forwardCurrent: 2, tolerance: 0.001 },
  output: { result: { onBranchConsistent: true, offBranchConsistent: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/ideal-diode-branch-drop-check",
  title: "Electricity: Ideal Diode Branch Drop Check Tool",
  description:
    "Check supplied ideal-diode operating-point consistency under an explicit absolute tolerance, not solve or certify a circuit.",
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
          offBranchConsistent: { type: "boolean" },
          onBranchConsistent: { type: "boolean" },
        },
        required: ["offBranchConsistent", "onBranchConsistent"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
