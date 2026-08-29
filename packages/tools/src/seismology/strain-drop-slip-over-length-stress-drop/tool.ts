import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const strainDropSlipOverLengthStressDropExample = {
  input: { slipM: 2, lengthKm: 20, rigidityGPa: 30 },
  output: { stressDropBar: 30, strainDrop: 0.0001 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const strainDropSlipOverLengthStressDropTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ slipM, lengthKm, rigidityGPa }) => {
      if (lengthKm <= 0) simpleError("lengthKm", "Length must be positive.");
      if (rigidityGPa <= 0)
        simpleError("rigidityGPa", "Rigidity must be positive.");
      const strain = slipM / (lengthKm * 1000);
      return {
        stressDropBar: (rigidityGPa * 1e9 * strain) / 1e5,
        strainDrop: strain,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "First-order stress drop from the strain-drop picture: Δσ ≈ μ·(D/L).",
  id: "seismology/strain-drop-slip-over-length-stress-drop",
  inputs: [
    {
      minimum: 0,
      description: "Average slip.",
      id: "slipM",
      kind: "number",
      label: "D",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Rupture length.",
      id: "lengthKm",
      kind: "number",
      label: "L",
      unit: "km",
    },
    {
      default: 30,
      minimum: 0,
      description: "Rigidity.",
      id: "rigidityGPa",
      kind: "number",
      label: "μ",
      unit: "GPa",
    },
  ],
  outputs: [
    {
      description: "Stress-drop estimate.",
      id: "stressDropBar",
      kind: "number",
      label: "Δσ",
      unit: "bar",
    },
    {
      description: "Dimensionless strain drop.",
      id: "strainDrop",
      kind: "number",
      label: "D/L",
    },
  ],
  title: "Strain Drop Slip Over Length Stress Drop",
});
export const runStrainDropSlipOverLengthStressDrop =
  strainDropSlipOverLengthStressDropTool.execute;
export { strainDropSlipOverLengthStressDropExample as example };
export default strainDropSlipOverLengthStressDropTool;
