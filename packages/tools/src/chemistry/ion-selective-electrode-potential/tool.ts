import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ionSelectiveElectrodePotentialExample = {
  input: { concentrationM: 0.01, interceptMV: 100, slopeMV: -59.16 },
  output: { electrodePotentialMV: 218.32 },
} satisfies ToolExample<
  {
    readonly concentrationM: number;
    readonly interceptMV: number;
    readonly slopeMV: number;
  },
  { readonly electrodePotentialMV: number }
>;

export const ionSelectiveElectrodePotentialTool = createSimpleTool({
  id: "chemistry/ion-selective-electrode-potential",
  title: "ISE Potential",
  description:
    "Compute the ion selective electrode potential from an intercept and slope applied to the log of the ion concentration.",
  inputs: [
    {
      id: "concentrationM",
      label: "Ion concentration",
      kind: "number",
      unit: "mol/L",
    },
    { id: "interceptMV", label: "Intercept", kind: "number", unit: "mV" },
    { id: "slopeMV", label: "Slope", kind: "number", unit: "mV" },
  ],
  outputs: [
    {
      id: "electrodePotentialMV",
      label: "Electrode potential",
      kind: "number",
      unit: "mV",
    },
  ],
  calculate: (input) => {
    const concentrationM = input.concentrationM as number;
    const interceptMV = input.interceptMV as number;
    const slopeMV = input.slopeMV as number;
    if (!(concentrationM > 0))
      simpleError("concentrationM", "Concentration must be positive.");
    if (!Number.isFinite(slopeMV))
      simpleError("slopeMV", "Slope must be finite.");
    return {
      electrodePotentialMV: interceptMV + slopeMV * Math.log10(concentrationM),
    };
  },
});
export const runIonSelectiveElectrodePotential =
  ionSelectiveElectrodePotentialTool.execute;
export default ionSelectiveElectrodePotentialTool;
