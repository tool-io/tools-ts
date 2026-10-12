import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly planetMassKg: number;
  readonly absorptionRadiusM: number;
  readonly xuvFluxWPerM2: number;
  readonly heatingEfficiency: number;
  readonly rocheCorrection: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "planetMassKg", label: "Planet mass kg", kind: "number" },
  { id: "absorptionRadiusM", label: "Absorption radius m", kind: "number" },
  { id: "xuvFluxWPerM2", label: "Xuv flux w per m2", kind: "number" },
  { id: "heatingEfficiency", label: "Heating efficiency", kind: "number" },
  { id: "rocheCorrection", label: "Roche correction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.planetMassKg, "mass");
  positive(i.absorptionRadiusM, "radius");
  nonnegative(i.xuvFluxWPerM2, "flux");
  fraction(i.heatingEfficiency, "efficiency");
  positive(i.rocheCorrection, "correction");
  return {
    conditionalMassLossKgPerS:
      (i.heatingEfficiency *
        Math.PI *
        i.absorptionRadiusM ** 3 *
        i.xuvFluxWPerM2) /
      (6.6743e-11 * i.planetMassKg * i.rocheCorrection),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    planetMassKg: 1e20,
    absorptionRadiusM: 1000000.0,
    xuvFluxWPerM2: 1,
    heatingEfficiency: 0.1,
    rocheCorrection: 1,
  },
  output: { result: { conditionalMassLossKgPerS: 47069994.659961246 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/hydrodynamic-escape-energy-limited-massloss",
  title: "Hydrodynamic Escape Energy-Limited Mass Loss Calculator",
  description:
    "Energy-limited XUV escape using same absorption/potential radius, independently established efficiency/Roche correction; no radiative/recombination limitation or hydrodynamic solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalMassLossKgPerS: { type: "number" } },
        required: ["conditionalMassLossKgPerS"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
