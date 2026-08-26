import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DoorLeafThicknessCheckInput = {
  readonly leafThicknessMm: number;
};

export type DoorLeafThicknessCheckOutput = {
  readonly isStandardThickness: boolean;
};

export const doorLeafThicknessExample = {
  input: { leafThicknessMm: 40 },
  output: { isStandardThickness: true },
} satisfies ToolExample<
  DoorLeafThicknessCheckInput,
  DoorLeafThicknessCheckOutput
>;

export const doorLeafThicknessTool = createSimpleTool({
  id: "carpentry/tuer-blatt-dicke-40-44mm",
  title: "Door Leaf Thickness Check",
  description:
    "Check whether a door leaf thickness lies in the standard 40 to 44 mm range.",
  inputs: [
    {
      description: "Door leaf thickness in millimeters.",
      id: "leafThicknessMm",
      kind: "number",
      label: "Leaf thickness",
      maximum: 70,
      minimum: 25,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "True when the leaf thickness is between 40 and 44 mm inclusive.",
      id: "isStandardThickness",
      kind: "boolean",
      label: "Standard thickness",
    },
  ],
  calculate: (input) => {
    const leafThicknessMm = input.leafThicknessMm as number;
    return {
      isStandardThickness: leafThicknessMm >= 40 && leafThicknessMm <= 44,
    };
  },
});
export const runDoorLeafThickness = doorLeafThicknessTool.execute;
export default doorLeafThicknessTool;
