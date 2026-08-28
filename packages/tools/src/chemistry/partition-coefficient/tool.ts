import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const PartitionCoefficientTool = createSimpleTool({
  id: "chemistry/partition-coefficient",
  title: "Partition Coefficient Calculator",
  description: "Compute partition coefficient Kd = C_organic/C_aqueous.",
  inputs: [
    {
      id: "organicConcentrationMolL",
      label: "Organic phase conc",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      id: "aqueousConcentrationMolL",
      label: "Aqueous phase conc",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [{ id: "partitionCoefficient", label: "Kd", kind: "number" }],
  calculate: (input) => {
    const aq = input.aqueousConcentrationMolL as number;
    if (aq === 0)
      simpleError("aqueousConcentrationMolL", "Cannot be zero.", "invalid_aq");
    return {
      partitionCoefficient: (input.organicConcentrationMolL as number) / aq,
    };
  },
});
export default PartitionCoefficientTool;
export const runPartitionCoefficient = PartitionCoefficientTool.execute;

export type PartitionCoefficientInput = {
  readonly organicConcentrationMolL: number;
  readonly aqueousConcentrationMolL: number;
};

export type PartitionCoefficientOutput = {
  readonly partitionCoefficient: number;
};

export const partitionCoefficientExample = {
  input: {
    organicConcentrationMolL: 1,
    aqueousConcentrationMolL: 1,
  },
  output: {
    partitionCoefficient: 1,
  },
} satisfies ToolExample<PartitionCoefficientInput, PartitionCoefficientOutput>;
