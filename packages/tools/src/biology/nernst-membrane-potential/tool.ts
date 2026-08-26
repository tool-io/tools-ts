import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nernstMembranePotentialExample = {
  input: { insideConcMm: 10, outsideConcMm: 100, zIonInt: 1 },
  output: { membranePotentialMV: 61.5 },
} satisfies ToolExample<
  {
    readonly insideConcMm: number;
    readonly outsideConcMm: number;
    readonly zIonInt: number;
  },
  { readonly membranePotentialMV: number }
>;

export const nernstMembranePotentialTool = createSimpleTool({
  id: "biology/nernst-membrane-potential",
  title: "Nernst Membrane Potential",
  description:
    "Compute the Nernst equilibrium potential at 37 degrees Celsius in millivolts: EMV = (61.5 / z) x log10(outsideConcentration / insideConcentration), signed positive for outward cation gradient driving force.",
  inputs: [
    {
      description: "Ion charge magnitude, an integer from 1 to 3.",
      id: "zIonInt",
      label: "Ion valence",
      kind: "integer",
      maximum: 3,
      minimum: 1,
    },
    {
      description:
        "Extracellular concentration in mmol/L; must be greater than zero.",
      id: "outsideConcMm",
      label: "Outside concentration",
      kind: "number",
      unit: "mmol/L",
    },
    {
      description:
        "Intracellular concentration in mmol/L; must be greater than zero.",
      id: "insideConcMm",
      label: "Inside concentration",
      kind: "number",
      unit: "mmol/L",
    },
  ],
  outputs: [
    {
      description: "Signed equilibrium potential in millivolts.",
      id: "membranePotentialMV",
      label: "Membrane potential",
      kind: "number",
      unit: "mV",
    },
  ],
  calculate: (input) => {
    const zIonInt = input.zIonInt as number;
    const outsideConcMm = input.outsideConcMm as number;
    const insideConcMm = input.insideConcMm as number;
    if (!(outsideConcMm > 0))
      simpleError(
        "outsideConcMm",
        "The outside concentration must be greater than zero.",
      );
    if (!(insideConcMm > 0))
      simpleError(
        "insideConcMm",
        "The inside concentration must be greater than zero.",
      );
    return {
      membranePotentialMV:
        (61.5 / zIonInt) * Math.log10(outsideConcMm / insideConcMm),
    };
  },
});
export const runNernstMembranePotential = nernstMembranePotentialTool.execute;
export default nernstMembranePotentialTool;
