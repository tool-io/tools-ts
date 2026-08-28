import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FluorescenceIntensityInput = {
  readonly absorptivityConstant: number;
  readonly concentrationM: number;
  readonly excitationIntensity: number;
  readonly quantumYieldFraction: number;
};

export type FluorescenceIntensityOutput = {
  readonly fluorescenceIntensity: number;
};

export const fluorescenceIntensityExample = {
  input: {
    quantumYieldFraction: 0.5,
    absorptivityConstant: 10000,
    concentrationM: 1e-6,
    excitationIntensity: 100,
  },
  output: { fluorescenceIntensity: 0.5 },
} satisfies ToolExample<
  FluorescenceIntensityInput,
  FluorescenceIntensityOutput
>;

export const fluorescenceIntensityTool = createSimpleTool({
  id: "chemistry/fluorescence-intensity",
  title: "Fluorescence Intensity",
  description:
    "Compute fluorescence intensity as quantum yield times molar absorptivity times concentration times excitation intensity.",
  inputs: [
    {
      id: "quantumYieldFraction",
      label: "Quantum yield",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "absorptivityConstant",
      label: "Absorptivity constant",
      kind: "number",
    },
    { id: "concentrationM", label: "Concentration", kind: "number", unit: "M" },
    {
      id: "excitationIntensity",
      label: "Excitation intensity",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "fluorescenceIntensity",
      label: "Fluorescence intensity",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const absorptivityConstant = input.absorptivityConstant as number;
    const concentrationM = input.concentrationM as number;
    const excitationIntensity = input.excitationIntensity as number;
    if (!(absorptivityConstant > 0))
      simpleError(
        "absorptivityConstant",
        "Absorptivity constant must be positive.",
        "invalid_absorptivity",
      );
    if (!(concentrationM > 0))
      simpleError(
        "concentrationM",
        "Concentration must be positive.",
        "invalid_concentration",
      );
    if (!(excitationIntensity > 0))
      simpleError(
        "excitationIntensity",
        "Excitation intensity must be positive.",
        "invalid_intensity",
      );
    return {
      fluorescenceIntensity:
        (input.quantumYieldFraction as number) *
        absorptivityConstant *
        concentrationM *
        excitationIntensity,
    };
  },
});
export const runFluorescenceIntensity = fluorescenceIntensityTool.execute;
export default fluorescenceIntensityTool;
