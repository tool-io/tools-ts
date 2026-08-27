import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const ratePressureProductExample = {
  input: { heartRateBpm: 70, systolicMmHg: 120 },
  output: { ratePressureProduct: 8.4 },
} satisfies ToolExample<
  { readonly heartRateBpm: number; readonly systolicMmHg: number },
  { readonly ratePressureProduct: number }
>;

export const ratePressureProductTool = createSimpleTool({
  id: "biology/rate-pressure-product",
  title: "RPP",
  description:
    "Compute the rate pressure product from heart rate and systolic pressure.",
  inputs: [
    {
      id: "heartRateBpm",
      kind: "number",
      label: "Heart rate",
      minimum: Number.MIN_VALUE,
      unit: "bpm",
    },
    {
      id: "systolicMmHg",
      kind: "number",
      label: "Systolic pressure",
      minimum: Number.MIN_VALUE,
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "ratePressureProduct",
      kind: "number",
      label: "Rate pressure product",
    },
  ],
  calculate: (input) => ({
    ratePressureProduct:
      ((input.heartRateBpm as number) * (input.systolicMmHg as number)) / 1000,
  }),
});
export const runRatePressureProduct = ratePressureProductTool.execute;
export default ratePressureProductTool;
