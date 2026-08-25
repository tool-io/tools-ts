import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bloodPressureCategoryExample = {
  input: { diastolicMmHg: 76, systolicMmHg: 118 },
  output: { category: "normal" },
} satisfies ToolExample<
  { readonly diastolicMmHg: number; readonly systolicMmHg: number },
  { readonly category: string }
>;

export const bloodPressureCategoryTool = createSimpleTool({
  id: "biology/blood-pressure-category",
  title: "BP Category Lookup",
  description:
    "Classify a blood pressure reading as normal, elevated, stage-1 or stage-2; systolic must exceed diastolic.",
  inputs: [
    {
      id: "systolicMmHg",
      kind: "number",
      label: "Systolic pressure",
      maximum: 300,
      minimum: 70,
      unit: "mmHg",
    },
    {
      id: "diastolicMmHg",
      kind: "number",
      label: "Diastolic pressure",
      maximum: 200,
      minimum: 40,
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "category",
      kind: "string",
      label: "Blood pressure category",
    },
  ],
  calculate: (input) => {
    const systolicMmHg = input.systolicMmHg as number;
    const diastolicMmHg = input.diastolicMmHg as number;
    if (!Number.isFinite(systolicMmHg) || !Number.isFinite(diastolicMmHg))
      simpleError(
        "systolicMmHg",
        "Pressures must be finite numbers.",
        "invalid_pressure",
      );
    if (!(systolicMmHg > diastolicMmHg))
      simpleError(
        "systolicMmHg",
        "Systolic pressure must exceed diastolic pressure.",
        "invalid_pressure",
      );
    return {
      category:
        systolicMmHg >= 140 || diastolicMmHg >= 90
          ? "stage-2"
          : systolicMmHg >= 130 || diastolicMmHg >= 80
            ? "stage-1"
            : systolicMmHg >= 120
              ? "elevated"
              : "normal",
    };
  },
});
export const runBloodPressureCategory = bloodPressureCategoryTool.execute;
export default bloodPressureCategoryTool;
