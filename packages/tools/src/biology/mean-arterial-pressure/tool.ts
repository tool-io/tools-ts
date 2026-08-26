import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const meanArterialPressureExample = {
  input: { diastolicMmHg: 80, systolicMmHg: 120 },
  output: { meanArterialPressure: 93.33333333333333 },
} satisfies ToolExample<
  { readonly diastolicMmHg: number; readonly systolicMmHg: number },
  { readonly meanArterialPressure: number }
>;

export const meanArterialPressureTool = createSimpleTool({
  id: "biology/mean-arterial-pressure",
  title: "MAP mmHg",
  description:
    "Compute mean arterial pressure from systolic and diastolic pressure.",
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
      id: "meanArterialPressure",
      kind: "number",
      label: "Mean arterial pressure",
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
    return {
      meanArterialPressure: diastolicMmHg + (systolicMmHg - diastolicMmHg) / 3,
    };
  },
});
export const runMeanArterialPressure = meanArterialPressureTool.execute;
export default meanArterialPressureTool;
