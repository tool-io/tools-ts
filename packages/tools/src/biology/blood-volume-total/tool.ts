import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BloodVolumeTotalInput = {
  readonly weightKg: number;
};

export type BloodVolumeTotalOutput = {
  readonly bloodVolumeMl: number;
};

export const bloodVolumeTotalExample = {
  input: { weightKg: 70 },
  output: { bloodVolumeMl: 4900 },
} satisfies ToolExample<BloodVolumeTotalInput, BloodVolumeTotalOutput>;

export const bloodVolumeTotalTool = createSimpleTool({
  id: "biology/blood-volume-total",
  title: "Total Blood Volume Estimate",
  description:
    "Estimate total blood volume from body weight using the documented reference value of 70 millilitres per kilogram.",
  inputs: [
    { id: "weightKg", label: "Body weight", kind: "number", unit: "kg" },
  ],
  outputs: [
    {
      id: "bloodVolumeMl",
      label: "Blood volume",
      kind: "number",
      unit: "mL",
    },
  ],
  calculate: (input) => {
    const weightKg = input.weightKg as number;
    if (weightKg <= 0)
      simpleError("weightKg", "The body weight must be greater than zero.");
    return { bloodVolumeMl: weightKg * 70 };
  },
});
export const runBloodVolumeTotal = bloodVolumeTotalTool.execute;
export default bloodVolumeTotalTool;
