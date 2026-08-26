import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const goldmanMembranePotentialExample = {
  input: {
    chlorideInsideMm: 30,
    chlorideOutsideMm: 110,
    chloridePermeability: 0.45,
    potassiumInsideMm: 140,
    potassiumOutsideMm: 4,
    potassiumPermeability: 1,
    sodiumInsideMm: 12,
    sodiumOutsideMm: 145,
    sodiumPermeability: 0.04,
  },
  output: { membranePotentialMV: -56.04814568218529 },
} satisfies ToolExample<
  {
    readonly chlorideInsideMm: number;
    readonly chlorideOutsideMm: number;
    readonly chloridePermeability: number;
    readonly potassiumInsideMm: number;
    readonly potassiumOutsideMm: number;
    readonly potassiumPermeability: number;
    readonly sodiumInsideMm: number;
    readonly sodiumOutsideMm: number;
    readonly sodiumPermeability: number;
  },
  { readonly membranePotentialMV: number }
>;

export const goldmanMembranePotentialTool = createSimpleTool({
  id: "biology/goldman-membrane-potential",
  title: "Goldman Equation",
  description:
    "Compute the Goldman-Hodgkin-Katz steady-state membrane potential at 37 degrees Celsius with the z=+1 cation form for potassium and sodium and inverted terms for chloride: VM = 61.5 x log10((pK x KOut + pNa x NaOut + pCl x ClIn) / (pK x KIn + pNa x NaIn + pCl x ClOut)) mV.",
  inputs: [
    {
      description: "Potassium relative permeability; must not be negative.",
      id: "potassiumPermeability",
      label: "PK",
      kind: "number",
    },
    {
      description: "Sodium relative permeability; must not be negative.",
      id: "sodiumPermeability",
      label: "PNa",
      kind: "number",
    },
    {
      description: "Chloride relative permeability; must not be negative.",
      id: "chloridePermeability",
      label: "PCl",
      kind: "number",
    },
    {
      description:
        "Extracellular potassium in mmol/L; must be greater than zero.",
      id: "potassiumOutsideMm",
      label: "K outside",
      kind: "number",
      unit: "mmol/L",
    },
    {
      description:
        "Intracellular potassium in mmol/L; must be greater than zero.",
      id: "potassiumInsideMm",
      label: "K inside",
      kind: "number",
      unit: "mmol/L",
    },
    {
      description: "Extracellular sodium in mmol/L; must be greater than zero.",
      id: "sodiumOutsideMm",
      label: "Na outside",
      kind: "number",
      unit: "mmol/L",
    },
    {
      description: "Intracellular sodium in mmol/L; must be greater than zero.",
      id: "sodiumInsideMm",
      label: "Na inside",
      kind: "number",
      unit: "mmol/L",
    },
    {
      description:
        "Extracellular chloride in mmol/L; must be greater than zero.",
      id: "chlorideOutsideMm",
      label: "Cl outside",
      kind: "number",
      unit: "mmol/L",
    },
    {
      description:
        "Intracellular chloride in mmol/L; must be greater than zero.",
      id: "chlorideInsideMm",
      label: "Cl inside",
      kind: "number",
      unit: "mmol/L",
    },
  ],
  outputs: [
    {
      description: "Signed resting membrane potential in millivolts.",
      id: "membranePotentialMV",
      label: "Membrane potential",
      kind: "number",
      unit: "mV",
    },
  ],
  calculate: (input) => {
    const pK = input.potassiumPermeability as number;
    const pNa = input.sodiumPermeability as number;
    const pCl = input.chloridePermeability as number;
    const kOut = input.potassiumOutsideMm as number;
    const kIn = input.potassiumInsideMm as number;
    const naOut = input.sodiumOutsideMm as number;
    const naIn = input.sodiumInsideMm as number;
    const clOut = input.chlorideOutsideMm as number;
    const clIn = input.chlorideInsideMm as number;
    if (!(pK >= 0) || !(pNa >= 0) || !(pCl >= 0))
      simpleError(
        "potassiumPermeability",
        "Permeabilities must not be negative.",
      );
    if (!(pK + pNa + pCl > 0))
      simpleError(
        "potassiumPermeability",
        "At least one permeability must be greater than zero.",
      );
    if (
      !(kOut > 0) ||
      !(kIn > 0) ||
      !(naOut > 0) ||
      !(naIn > 0) ||
      !(clOut > 0) ||
      !(clIn > 0)
    )
      simpleError("potassiumOutsideMm", "All concentrations must be positive.");
    return {
      membranePotentialMV:
        61.5 *
        Math.log10(
          (pK * kOut + pNa * naOut + pCl * clIn) /
            (pK * kIn + pNa * naIn + pCl * clOut),
        ),
    };
  },
});
export const runGoldmanMembranePotential = goldmanMembranePotentialTool.execute;
export default goldmanMembranePotentialTool;
