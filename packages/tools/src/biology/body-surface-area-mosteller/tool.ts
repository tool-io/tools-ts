import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const bodySurfaceAreaMostellerExample = {
  input: { heightCm: 170, weightKg: 60 },
  output: { bsaM2: 1.6832508230603465 },
} satisfies ToolExample<
  { readonly heightCm: number; readonly weightKg: number },
  { readonly bsaM2: number }
>;

export const bodySurfaceAreaMostellerTool = createSimpleTool({
  id: "biology/body-surface-area-mosteller",
  title: "BSA Mosteller",
  description: "Estimate body surface area with the Mosteller formula.",
  inputs: [
    {
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      id: "weightKg",
      kind: "number",
      label: "Weight",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
  ],
  outputs: [
    {
      id: "bsaM2",
      kind: "number",
      label: "Body surface area",
      unit: "m^2",
    },
  ],
  calculate: (input) => ({
    bsaM2: Math.sqrt(
      ((input.heightCm as number) * (input.weightKg as number)) / 3600,
    ),
  }),
});
export const runBodySurfaceAreaMosteller = bodySurfaceAreaMostellerTool.execute;
export default bodySurfaceAreaMostellerTool;
