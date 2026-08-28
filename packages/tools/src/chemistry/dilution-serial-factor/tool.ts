import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const dilutionSerialFactorTool = createSimpleTool({
  id: "chemistry/dilution-serial-factor",
  title: "Serial Dilution Factor Calculator",
  description:
    "Compute the total cumulative dilution factor across a serial dilution as (dilution per step)^steps.",
  inputs: [
    {
      description:
        "Dilution ratio applied at each step; must be greater than zero.",
      id: "dilutionPerStep",
      label: "Dilution per step",
      kind: "number",
    },
    {
      description: "Number of sequential dilution steps; must be at least one.",
      id: "steps",
      label: "Steps",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Total cumulative dilution factor.",
      id: "totalDilutionFactor",
      label: "Total factor",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const steps = input.steps as number;
    if (steps < 1)
      simpleError(
        "steps",
        "The step count must be at least one.",
        "invalid_steps",
      );
    return { totalDilutionFactor: (input.dilutionPerStep as number) ** steps };
  },
});
export const runDilutionSerialFactor = dilutionSerialFactorTool.execute;
export default dilutionSerialFactorTool;

export type DilutionSerialFactorInput = {
  readonly dilutionPerStep: number;
  readonly steps: number;
};

export type DilutionSerialFactorOutput = {
  readonly totalDilutionFactor: number;
};

export const dilutionSerialFactorExample = {
  input: {
    dilutionPerStep: 1,
    steps: 1,
  },
  output: {
    totalDilutionFactor: 1,
  },
} satisfies ToolExample<DilutionSerialFactorInput, DilutionSerialFactorOutput>;
