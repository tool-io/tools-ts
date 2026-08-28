import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const CalorimeterConstantTool = createSimpleTool({
  id: "chemistry/calorimeter-constant",
  title: "Calorimeter Constant Calculator",
  description: "Compute calorimeter constant C_cal = q / dT.",
  inputs: [
    { id: "heatJoules", label: "q", kind: "number", minimum: 0, unit: "J" },
    {
      id: "deltaTK",
      label: "Delta T",
      kind: "number",
      description: "Must be nonzero.",
    },
  ],
  outputs: [
    {
      id: "calorimeterConstantJK",
      label: "C_cal",
      kind: "number",
      unit: "J/K",
    },
  ],
  calculate: (input) => {
    const dt = input.deltaTK as number;
    if (dt <= 0)
      simpleError(
        "deltaTK",
        "Temperature rise must be greater than zero.",
        "invalid_dt",
      );
    return { calorimeterConstantJK: (input.heatJoules as number) / dt };
  },
});
export default CalorimeterConstantTool;
export const runCalorimeterConstant = CalorimeterConstantTool.execute;

export type CalorimeterConstantInput = {
  readonly heatJoules: number;
  readonly deltaTK: number;
};

export type CalorimeterConstantOutput = {
  readonly calorimeterConstantJK: number;
};

export const calorimeterConstantExample = {
  input: {
    heatJoules: 1,
    deltaTK: 1,
  },
  output: {
    calorimeterConstantJK: 1,
  },
} satisfies ToolExample<CalorimeterConstantInput, CalorimeterConstantOutput>;
