import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const FugacityTool = createSimpleTool({
  id: "chemistry/fugacity",
  title: "Fugacity Calculator",
  description: "Compute fugacity f = phi * P.",
  inputs: [
    {
      id: "phiCoefficient",
      label: "Phi coefficient",
      kind: "number",
      minimum: 0,
    },
    {
      id: "pressureAtm",
      label: "Pressure",
      kind: "number",
      minimum: 0,
      unit: "atm",
    },
  ],
  outputs: [
    { id: "fugacityAtm", label: "Fugacity", kind: "number", unit: "atm" },
  ],
  calculate: (input) => {
    return {
      fugacityAtm:
        (input.phiCoefficient as number) * (input.pressureAtm as number),
    };
  },
});
export default FugacityTool;
export const runFugacity = FugacityTool.execute;

export type FugacityInput = {
  readonly phiCoefficient: number;
  readonly pressureAtm: number;
};

export type FugacityOutput = {
  readonly fugacityAtm: number;
};

export const fugacityExample = {
  input: {
    phiCoefficient: 1,
    pressureAtm: 1,
  },
  output: {
    fugacityAtm: 1,
  },
} satisfies ToolExample<FugacityInput, FugacityOutput>;
