import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CoordinationNumberInput = {
  readonly unitCellType: string;
};

export type CoordinationNumberOutput = {
  readonly coordinationNumber: number;
};

export const coordinationNumberExample = {
  input: { unitCellType: "face-centered-cubic" },
  output: { coordinationNumber: 12 },
} satisfies ToolExample<CoordinationNumberInput, CoordinationNumberOutput>;

const coordinationNumbers = {
  "body-centered-cubic": 8,
  "face-centered-cubic": 12,
  "hexagonal-close-packed": 12,
  "simple-cubic": 6,
} as const;

export const calculateCoordinationNumber = (
  input: CoordinationNumberInput,
): CoordinationNumberOutput => ({
  coordinationNumber:
    coordinationNumbers[input.unitCellType as keyof typeof coordinationNumbers],
});

export const CoordinationNumberTool = createSimpleTool({
  calculate: (input) =>
    calculateCoordinationNumber(input as unknown as CoordinationNumberInput),
  description:
    "Look up the number of nearest neighbours around an atom for the common cubic and close-packed structures.",
  id: "chemistry/coordination-number",
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
      description: "Nearest neighbours touching a central atom.",
      id: "coordinationNumber",
      kind: "integer",
      label: "Coordination number",
    },
  ],
  title: "Coordination Number Calculator",
});
export const runCoordinationNumber = CoordinationNumberTool.execute;
export default CoordinationNumberTool;
