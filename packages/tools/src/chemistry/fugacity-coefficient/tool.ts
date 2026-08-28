import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const FugacityCoefficientTool = createSimpleTool({
  id: "chemistry/fugacity-coefficient",
  title: "Fugacity Coefficient Calculator",
  description: "Compute fugacity coefficient phi = f/P.",
  inputs: [
    {
      id: "fugacityAtm",
      label: "Fugacity",
      kind: "number",
      minimum: 0,
      unit: "atm",
    },
    {
      id: "pressureAtm",
      label: "Pressure",
      kind: "number",
      minimum: 0,
      unit: "atm",
    },
  ],
  outputs: [{ id: "phiCoefficient", label: "Phi coefficient", kind: "number" }],
  calculate: (input) => {
    if (!((input.pressureAtm as number) > 0))
      simpleError(
        "pressureAtm",
        "Pressure must be greater than zero.",
        "invalid_pressure",
      );
    if ((input.fugacityAtm as number) < 0)
      simpleError(
        "fugacityAtm",
        "Fugacity cannot be negative.",
        "invalid_fugacity",
      );
    return {
      phiCoefficient:
        (input.fugacityAtm as number) / (input.pressureAtm as number),
    };
  },
});
export default FugacityCoefficientTool;
export const runFugacityCoefficient = FugacityCoefficientTool.execute;

export type FugacityCoefficientInput = {
  readonly fugacityAtm: number;
  readonly pressureAtm: number;
};

export type FugacityCoefficientOutput = {
  readonly phiCoefficient: number;
};

export const fugacityCoefficientExample = {
  input: {
    fugacityAtm: 1,
    pressureAtm: 1,
  },
  output: {
    phiCoefficient: 1,
  },
} satisfies ToolExample<FugacityCoefficientInput, FugacityCoefficientOutput>;
