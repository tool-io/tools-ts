import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const quarterWaveLayerHigherModeHarmonicsCalculatorExample = {
  input: { layerThicknessM: 30, shearVelocityMS: 300, modeCount: 3 },
  output: { harmonicFrequenciesHz: [2.5, 7.5, 12.5] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const quarterWaveLayerHigherModeHarmonicsCalculatorTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ layerThicknessM, shearVelocityMS, modeCount }) => {
        if (!(layerThicknessM > 0))
          simpleError("layerThicknessM", "Layer thickness must be positive.");
        if (!(shearVelocityMS > 0))
          simpleError(
            "shearVelocityMS",
            "Shear-wave velocity must be positive.",
          );
        const N = modeCount ?? 3;
        const out = [];
        for (let n = 1; n <= N; n++)
          out.push(((2 * n - 1) * shearVelocityMS) / (4 * layerThicknessM));
        return { harmonicFrequenciesHz: out };
      })(input as never) as Record<string, unknown>,
    description:
      "Quarter-wavelength harmonics f_n = (2n−1)·Vs/(4H) for a layer over stiff half-space.",
    id: "seismology/quarter-wave-layer-higher-mode-harmonics-calculator",
    inputs: [
      {
        minimum: 0,
        description: "Layer thickness.",
        id: "layerThicknessM",
        kind: "number",
        label: "H",
        unit: "m",
      },
      {
        minimum: 0,
        description: "Layer shear velocity.",
        id: "shearVelocityMS",
        kind: "number",
        label: "Vs",
        unit: "m/s",
      },
      {
        default: 3,
        minimum: 1,
        maximum: 10,
        description: "Number of modes.",
        id: "modeCount",
        kind: "integer",
        label: "N",
      },
    ],
    outputs: [
      {
        description: "Odd-quarter-wave harmonic frequencies.",
        id: "harmonicFrequenciesHz",
        kind: "numberList",
        label: "f_n",
        unit: "Hz",
      },
    ],
    title: "Quarter Wave Layer Higher Mode Harmonics Calculator",
  });
export const runQuarterWaveLayerHigherModeHarmonicsCalculator =
  quarterWaveLayerHigherModeHarmonicsCalculatorTool.execute;
export { quarterWaveLayerHigherModeHarmonicsCalculatorExample as example };
export default quarterWaveLayerHigherModeHarmonicsCalculatorTool;
