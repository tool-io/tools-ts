import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wellLogAcousticImpedanceReflectionCoefficientExample = {
  input: { impedanceUpper: 6000000, impedanceLower: 9000000 },
  output: {
    reflectionCoefficient: 0.2,
    polarityNote: "positive: hard kick (SEG normal)",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const wellLogAcousticImpedanceReflectionCoefficientTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ impedanceUpper, impedanceLower }) => {
        if (impedanceUpper + impedanceLower === 0)
          simpleError(
            "impedanceUpper",
            "At least one impedance must be positive.",
          );
        const r =
          (impedanceLower - impedanceUpper) / (impedanceLower + impedanceUpper);
        return {
          reflectionCoefficient: r,
          polarityNote:
            r > 0
              ? "positive: hard kick (SEG normal)"
              : r < 0
                ? "negative: soft kick (SEG normal)"
                : "zero contrast",
        };
      })(input as never) as Record<string, unknown>,
    description:
      "Normal-incidence reflection coefficient from acoustic impedances: R=(Z₂−Z₁)/(Z₂+Z₁).",
    id: "seismology/well-log-acoustic-impedance-reflection-coefficient",
    inputs: [
      {
        minimum: 0,
        description: "Upper-layer impedance (kg/m²s).",
        id: "impedanceUpper",
        kind: "number",
        label: "Z₁",
      },
      {
        minimum: 0,
        description: "Lower-layer impedance (kg/m²s).",
        id: "impedanceLower",
        kind: "number",
        label: "Z₂",
      },
    ],
    outputs: [
      {
        description: "Normal-incidence reflection coefficient.",
        id: "reflectionCoefficient",
        kind: "number",
        label: "R",
      },
      {
        description: "Sign interpretation (SEG normal).",
        id: "polarityNote",
        kind: "string",
        label: "Polarity",
      },
    ],
    title: "Well Log Acoustic Impedance Reflection Coefficient",
  });
export const runWellLogAcousticImpedanceReflectionCoefficient =
  wellLogAcousticImpedanceReflectionCoefficientTool.execute;
export { wellLogAcousticImpedanceReflectionCoefficientExample as example };
export default wellLogAcousticImpedanceReflectionCoefficientTool;
