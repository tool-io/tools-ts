import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pulsePressureExample = {
  input: { diastolicMmHg: 80, systolicMmHg: 120 },
  output: { pulsePressure: 40 },
} satisfies ToolExample<
  { readonly diastolicMmHg: number; readonly systolicMmHg: number },
  { readonly pulsePressure: number }
>;

export const pulsePressureTool = createSimpleTool({
  id: "biology/pulse-pressure",
  title: "Pulse Pressure",
  description: "Compute pulse pressure as systolic minus diastolic pressure.",
  inputs: [
    {
      id: "systolicMmHg",
      kind: "number",
      label: "Systolic pressure",
      unit: "mmHg",
    },
    {
      id: "diastolicMmHg",
      kind: "number",
      label: "Diastolic pressure",
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "pulsePressure",
      kind: "number",
      label: "Pulse pressure",
      unit: "mmHg",
    },
  ],
  calculate: (input) => {
    const systolicMmHg = input.systolicMmHg as number;
    const diastolicMmHg = input.diastolicMmHg as number;
    if (systolicMmHg <= diastolicMmHg)
      simpleError(
        "systolicMmHg",
        "Systolic pressure must exceed diastolic pressure.",
        "invalid_pressure",
      );
    return { pulsePressure: systolicMmHg - diastolicMmHg };
  },
});
export const runPulsePressure = pulsePressureTool.execute;
export default pulsePressureTool;
