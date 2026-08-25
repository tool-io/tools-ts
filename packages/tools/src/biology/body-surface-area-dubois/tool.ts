import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const bodySurfaceAreaDuboisExample = {
  input: { heightCm: 170, weightKg: 60 },
  output: { bsaM2: 1.6949468066347388 },
} satisfies ToolExample<
  { readonly heightCm: number; readonly weightKg: number },
  { readonly bsaM2: number }
>;

export const bodySurfaceAreaDuboisTool = createSimpleTool({
  id: "biology/body-surface-area-dubois",
  title: "BSA DuBois",
  description: "Estimate body surface area with the DuBois formula.",
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
    bsaM2:
      0.007184 *
      Math.pow(input.heightCm as number, 0.725) *
      Math.pow(input.weightKg as number, 0.425),
  }),
});
export const runBodySurfaceAreaDubois = bodySurfaceAreaDuboisTool.execute;
export default bodySurfaceAreaDuboisTool;
