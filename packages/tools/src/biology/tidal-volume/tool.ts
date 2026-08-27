import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tidalVolumeExample = {
  input: { weightKg: 70 },
  output: { tidalVolumeMl: 560 },
} satisfies ToolExample<
  { readonly weightKg: number },
  { readonly tidalVolumeMl: number }
>;

export const tidalVolumeTool = createSimpleTool({
  id: "biology/tidal-volume",
  title: "Tidal Volume Estimate (Radford)",
  description:
    "Estimate tidal volume using the Radford approximation of 8 mL per kilogram of body weight.",
  inputs: [
    {
      id: "weightKg",
      kind: "number",
      label: "Body weight",
      unit: "kg",
    },
  ],
  outputs: [
    {
      id: "tidalVolumeMl",
      kind: "number",
      label: "Tidal volume",
      unit: "mL",
    },
  ],
  calculate: (input) => {
    const weightKg = input.weightKg as number;
    if (!(weightKg > 0)) simpleError("weightKg", "Weight must be positive.");
    return { tidalVolumeMl: weightKg * 8 };
  },
});
export const runTidalVolume = tidalVolumeTool.execute;
export default tidalVolumeTool;
