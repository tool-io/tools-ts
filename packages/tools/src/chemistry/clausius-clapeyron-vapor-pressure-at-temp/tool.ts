import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const clausiusVaporPressureAtTempExample = {
  input: {
    deltaHvapJPerMol: 40650,
    p1Hpa: 100,
    t1K: 373.15,
    t2K: 298.15,
  },
  output: { vaporPressureHpa2: 3.7036007946814156 },
} satisfies ToolExample<
  {
    readonly deltaHvapJPerMol: number;
    readonly p1Hpa: number;
    readonly t1K: number;
    readonly t2K: number;
  },
  { readonly vaporPressureHpa2: number }
>;

export const clausiusVaporPressureAtTempTool = createSimpleTool({
  id: "chemistry/clausius-clapeyron-vapor-pressure-at-temp",
  title: "Clausius Vapor Pressure At T",
  description:
    "Compute the vapor pressure at a second temperature from the Clausius-Clapeyron relation using a reference pressure and enthalpy of vaporization.",
  inputs: [
    {
      id: "p1Hpa",
      label: "Reference vapor pressure P1",
      kind: "number",
      unit: "hPa",
    },
    {
      id: "deltaHvapJPerMol",
      label: "Enthalpy of vaporization",
      kind: "number",
      unit: "J/mol",
    },
    { id: "t1K", label: "Reference temperature T1", kind: "number", unit: "K" },
    { id: "t2K", label: "Target temperature T2", kind: "number", unit: "K" },
  ],
  outputs: [
    {
      id: "vaporPressureHpa2",
      label: "Vapor pressure at T2",
      kind: "number",
      unit: "hPa",
    },
  ],
  calculate: (input) => {
    const p1Hpa = input.p1Hpa as number;
    const deltaHvapJPerMol = input.deltaHvapJPerMol as number;
    const t1K = input.t1K as number;
    const t2K = input.t2K as number;
    if (!(p1Hpa > 0)) simpleError("p1Hpa", "Vapor pressure must be positive.");
    if (!(deltaHvapJPerMol > 0))
      simpleError(
        "deltaHvapJPerMol",
        "Enthalpy of vaporization must be positive.",
      );
    if (!(t1K > 0)) simpleError("t1K", "Temperature T1 must be positive.");
    if (!(t2K > 0)) simpleError("t2K", "Temperature T2 must be positive.");
    const lnP2 =
      Math.log(p1Hpa) - (deltaHvapJPerMol / R_GAS) * (1 / t2K - 1 / t1K);
    return { vaporPressureHpa2: Math.exp(lnP2) };
  },
});
export const runClausiusVaporPressureAtTemp =
  clausiusVaporPressureAtTempTool.execute;
export default clausiusVaporPressureAtTempTool;
