import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const hessLawTool = createSimpleTool({
  id: "chemistry/hess-law",
  title: "Hess Law Calculator",
  description: "Calculate hess law calculator.",
  inputs: [
    {
      description: "Enthalpies per step.",
      id: "stepEnthalpiesKJPerMol",
      kind: "numberList",
      label: "Steps",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Overall enthalpy.",
      id: "totalEnthalpyKJPerMol",
      kind: "number",
      label: "Total dH",
    },
  ],
  calculate: (input) => {
    return {
      totalEnthalpyKJPerMol: (input.stepEnthalpiesKJPerMol as number[]).reduce(
        (a, b) => a + b,
        0,
      ),
    };
  },
});
export default hessLawTool;
export const runHessLaw = hessLawTool.execute;

export type HessLawInput = {
  readonly stepEnthalpiesKJPerMol: readonly number[];
};

export type HessLawOutput = {
  readonly totalEnthalpyKJPerMol: number;
};

export const hessLawExample = {
  input: {
    stepEnthalpiesKJPerMol: [1],
  },
  output: {
    totalEnthalpyKJPerMol: 1,
  },
} satisfies ToolExample<HessLawInput, HessLawOutput>;
