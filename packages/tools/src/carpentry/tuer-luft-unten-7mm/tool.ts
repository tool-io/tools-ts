import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DoorFloorClearanceInput = {
  readonly floorClearanceMm?: number;
  readonly openingHeightMm: number;
};

export type DoorFloorClearanceOutput = {
  readonly finishedLeafHeightMm: number;
};

export const doorFloorClearanceExample = {
  input: { openingHeightMm: 1985 },
  output: { finishedLeafHeightMm: 1978 },
} satisfies ToolExample<DoorFloorClearanceInput, DoorFloorClearanceOutput>;

export const doorFloorClearanceTool = createSimpleTool({
  id: "carpentry/tuer-luft-unten-7mm",
  title: "Door Floor Clearance Calculator",
  description:
    "Compute the finished door leaf height from the opening height minus the floor clearance below the leaf.",
  inputs: [
    {
      description: "Finished opening height in millimeters.",
      id: "openingHeightMm",
      kind: "number",
      label: "Opening height",
      unit: "mm",
    },
    {
      default: 7,
      description:
        "Gap between the finished floor and the bottom of the leaf in millimeters.",
      id: "floorClearanceMm",
      kind: "number",
      label: "Floor clearance",
      maximum: 30,
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Door leaf height to cut in millimeters.",
      id: "finishedLeafHeightMm",
      kind: "number",
      label: "Finished leaf height",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const openingHeightMm = input.openingHeightMm as number;
    if (openingHeightMm <= 0)
      simpleError(
        "openingHeightMm",
        "The opening height must be greater than zero.",
        "must_be_positive",
      );
    const floorClearanceMm = input.floorClearanceMm as number;
    if (openingHeightMm - floorClearanceMm <= 0)
      simpleError(
        "floorClearanceMm",
        "The floor clearance must leave a positive finished leaf height.",
        "clearance_too_large",
      );
    return { finishedLeafHeightMm: openingHeightMm - floorClearanceMm };
  },
});
export const runDoorFloorClearance = doorFloorClearanceTool.execute;
export default doorFloorClearanceTool;
