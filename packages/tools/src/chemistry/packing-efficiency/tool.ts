import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PackingEfficiencyInput = {
  readonly unitCellType: string;
};

export type PackingEfficiencyOutput = {
  readonly packingEfficiencyPercent: number;
};

export const packingEfficiencyExample = {
  input: { unitCellType: "body-centered-cubic" },
  output: { packingEfficiencyPercent: 68.01747615878317 },
} satisfies ToolExample<PackingEfficiencyInput, PackingEfficiencyOutput>;

const packingFractions = {
  "body-centered-cubic": (Math.sqrt(3) * Math.PI) / 8,
  "face-centered-cubic": Math.PI / (3 * Math.sqrt(2)),
  "hexagonal-close-packed": Math.PI / (3 * Math.sqrt(2)),
  "simple-cubic": Math.PI / 6,
} as const;

export const calculatePackingEfficiency = (
  input: PackingEfficiencyInput,
): PackingEfficiencyOutput => {
  const fraction = (packingFractions as Record<string, number | undefined>)[
    input.unitCellType
  ];
  if (fraction === undefined)
    return simpleError(
      "unitCellType",
      "Unsupported unit cell packing.",
      "invalid_value",
    );
  return { packingEfficiencyPercent: fraction * 100 };
};

export const PackingEfficiencyTool = createSimpleTool({
  calculate: (input) =>
    calculatePackingEfficiency(input as unknown as PackingEfficiencyInput),
  description:
    "Compute the percent of a unit cell volume filled by hard-sphere atoms for the common cubic and close-packed packings.",
  id: "chemistry/packing-efficiency",
  inputs: [
    {
      description: "Packing of the unit cell.",
      enum: [
        "body-centered-cubic",
        "face-centered-cubic",
        "hexagonal-close-packed",
        "simple-cubic",
      ],
      id: "unitCellType",
      kind: "string",
      label: "Unit cell type",
    },
  ],
  outputs: [
    {
      description: "Fraction of the cell volume occupied by spheres.",
      id: "packingEfficiencyPercent",
      kind: "number",
      label: "Packing efficiency",
      unit: "%",
    },
  ],
  title: "Packing Efficiency Calculator",
});
export const runPackingEfficiency = PackingEfficiencyTool.execute;
export default PackingEfficiencyTool;
