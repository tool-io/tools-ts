import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpectroscopyPathLengthInput = {
  readonly absorbance: number;
  readonly concentrationM: number;
  readonly epsilon: number;
};

export type SpectroscopyPathLengthOutput = {
  readonly pathLengthCm: number;
};

export const spectroscopyPathLengthExample = {
  input: { absorbance: 1, epsilon: 20000, concentrationM: 1e-4 },
  output: { pathLengthCm: 0.5 },
} satisfies ToolExample<
  SpectroscopyPathLengthInput,
  SpectroscopyPathLengthOutput
>;

export const spectroscopyPathLengthTool = createSimpleTool({
  id: "chemistry/spectroscopy-path-length",
  title: "Path Length From Beer Law",
  description:
    "Compute the optical path length from the Beer-Lambert law as absorbance divided by molar absorptivity times concentration.",
  inputs: [
    { id: "absorbance", label: "Absorbance", kind: "number" },
    {
      id: "epsilon",
      label: "Molar absorptivity",
      kind: "number",
      unit: "L/(mol·cm)",
    },
    { id: "concentrationM", label: "Concentration", kind: "number", unit: "M" },
  ],
  outputs: [
    { id: "pathLengthCm", label: "Path length", kind: "number", unit: "cm" },
  ],
  calculate: (input) => {
    const absorbance = input.absorbance as number;
    const epsilon = input.epsilon as number;
    const concentrationM = input.concentrationM as number;
    if (!(absorbance > 0))
      simpleError(
        "absorbance",
        "Absorbance must be positive.",
        "invalid_absorbance",
      );
    if (!(epsilon > 0))
      simpleError(
        "epsilon",
        "Molar absorptivity must be positive.",
        "invalid_epsilon",
      );
    if (!(concentrationM > 0))
      simpleError(
        "concentrationM",
        "Concentration must be positive.",
        "invalid_concentration",
      );
    return { pathLengthCm: absorbance / (epsilon * concentrationM) };
  },
});
export const runSpectroscopyPathLength = spectroscopyPathLengthTool.execute;
export default spectroscopyPathLengthTool;
