import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pWaveModulusConstrainedExample = {
  input: { densityKgM3: 2700, vpKmS: 6.5 },
  output: { modulusGPa: 114.075 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const pWaveModulusConstrainedTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ densityKgM3, vpKmS }) => {
      if (!(densityKgM3 > 0))
        simpleError("densityKgM3", "Density must be positive.");
      if (!(vpKmS > 0))
        simpleError("vpKmS", "P-wave velocity must be positive.");
      return { modulusGPa: (densityKgM3 * Math.pow(vpKmS * 1000, 2)) / 1e9 };
    })(input as never) as Record<string, unknown>,
  description: "Compute the P-wave modulus M = ρ·Vp².",
  id: "seismology/p-wave-modulus-constrained",
  inputs: [
    {
      default: 2700,
      description: "Density.",
      id: "densityKgM3",
      kind: "number",
      label: "ρ",
      unit: "kg/m³",
    },
    {
      minimum: 0,
      description: "P-wave velocity.",
      id: "vpKmS",
      kind: "number",
      label: "V_p",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Constrained modulus.",
      id: "modulusGPa",
      kind: "number",
      label: "M",
      unit: "GPa",
    },
  ],
  title: "P Wave Modulus Constrained Calculator",
});
export const runPWaveModulusConstrained = pWaveModulusConstrainedTool.execute;
export { pWaveModulusConstrainedExample as example };
export default pWaveModulusConstrainedTool;
