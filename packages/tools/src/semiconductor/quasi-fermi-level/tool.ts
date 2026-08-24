import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuasiFermiLevelInput = {
  readonly electronConc: number;
  readonly intrinsicConc: number;
};

export type QuasiFermiLevelOutput = {
  readonly quasiFermiShiftEv: number;
};

const THERMAL_VOLTAGE_V = 0.02585;

export const quasiFermiLevelExample = {
  input: { electronConc: 1e16, intrinsicConc: 1e10 },
  output: { quasiFermiShiftEv: 0.3571309479233766 },
} satisfies ToolExample<QuasiFermiLevelInput, QuasiFermiLevelOutput>;

export const quasiFermiLevelTool = createSimpleTool({
  id: "semiconductor/quasi-fermi-level",
  title: "Electron Quasi-Fermi Level Shift Calculator",
  description:
    "Compute the electron quasi-Fermi level relative to the intrinsic level from their concentration ratio under the nondegenerate 300 K approximation.",
  inputs: [
    {
      id: "electronConc",
      label: "Electron concentration",
      kind: "number",
      minimum: 0,
      unit: "cm^-3",
      format: "density-per-cm3",
      description: "Electron concentration under bias.",
    },
    {
      id: "intrinsicConc",
      label: "Intrinsic concentration",
      kind: "number",
      minimum: 0,
      unit: "cm^-3",
      format: "density-per-cm3",
      description: "Intrinsic carrier concentration.",
    },
  ],
  outputs: [
    {
      id: "quasiFermiShiftEv",
      label: "Quasi-Fermi shift",
      kind: "number",
      unit: "eV",
      description:
        "Electron quasi-Fermi level relative to the intrinsic level.",
    },
  ],
  calculate: (input) => {
    const electronConc = input.electronConc as number;
    const intrinsicConc = input.intrinsicConc as number;
    if (electronConc <= 0)
      simpleError(
        "electronConc",
        "Electron concentration must be positive.",
        "invalid_concentration",
      );
    if (intrinsicConc <= 0)
      simpleError(
        "intrinsicConc",
        "Intrinsic concentration must be positive.",
        "invalid_intrinsic_conc",
      );
    return {
      quasiFermiShiftEv:
        THERMAL_VOLTAGE_V * (Math.log(electronConc) - Math.log(intrinsicConc)),
    };
  },
});
export const runQuasiFermiLevel = quasiFermiLevelTool.execute;
export default quasiFermiLevelTool;
