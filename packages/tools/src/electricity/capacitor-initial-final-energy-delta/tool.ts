import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  capacitance: number;
  initialVoltage: number;
  finalVoltage: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "capacitance", label: "Capacitance", kind: "number" },
  { id: "initialVoltage", label: "Initial voltage", kind: "number" },
  { id: "finalVoltage", label: "Final voltage", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.capacitance >= 0);
  return H.finish({
    initialEnergy: 0.5 * i.capacitance * i.initialVoltage ** 2,
    finalEnergy: 0.5 * i.capacitance * i.finalVoltage ** 2,
    energyDelta:
      0.5 *
      i.capacitance *
      (i.finalVoltage - i.initialVoltage) *
      (i.finalVoltage + i.initialVoltage),
  });
};
export const example = {
  input: { capacitance: 2, initialVoltage: 3, finalVoltage: 4 },
  output: { result: { initialEnergy: 9, finalEnergy: 16, energyDelta: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/capacitor-initial-final-energy-delta",
  title: "Electricity: Capacitor Initial Final Energy Delta Tool",
  description:
    "Compute ideal capacitor stored-energy change between explicit signed initial/final voltages, independent of charge polarity; excludes losses and dielectric nonlinearities.",
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
          energyDelta: { type: "number" },
          finalEnergy: { type: "number" },
          initialEnergy: { type: "number" },
        },
        required: ["energyDelta", "finalEnergy", "initialEnergy"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
