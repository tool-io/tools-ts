import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScrewPilotHoleInput = {
  readonly screwDiameterMm: number;
  readonly screwLengthMm: number;
};

export type ScrewPilotHoleOutput = {
  readonly pilotHoleDiameterMm: number;
  readonly pilotHoleDepthMm: number;
};

export const screwPilotHoleExample = {
  input: { screwDiameterMm: 4, screwLengthMm: 30 },
  output: { pilotHoleDiameterMm: 3, pilotHoleDepthMm: 24 },
} satisfies ToolExample<ScrewPilotHoleInput, ScrewPilotHoleOutput>;

export const screwPilotHoleTool = createSimpleTool({
  id: "carpentry/spanplattenschraube-4x30-vorbohrung-25mm",
  title: "Screw Pilot Hole Calculator",
  description:
    "Compute pilot hole diameter and depth for a wood screw with 6 mm tip clearance.",
  inputs: [
    {
      default: 4,
      description: "Outer thread diameter of the screw in millimeters.",
      id: "screwDiameterMm",
      kind: "number",
      label: "Screw diameter",
      unit: "mm",
    },
    {
      default: 30,
      description: "Full length of the screw in millimeters.",
      id: "screwLengthMm",
      kind: "number",
      label: "Screw length",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Pilot hole core-hole diameter in millimeters.",
      id: "pilotHoleDiameterMm",
      kind: "number",
      label: "Pilot hole diameter",
      unit: "mm",
    },
    {
      description:
        "Pilot hole depth in millimeters minus the 6 mm screw tip clearance.",
      id: "pilotHoleDepthMm",
      kind: "number",
      label: "Pilot hole depth",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const screwDiameterMm = input.screwDiameterMm as number;
    const screwLengthMm = input.screwLengthMm as number;
    if (!(screwDiameterMm > 0))
      simpleError(
        "screwDiameterMm",
        "Screw diameter must be positive.",
        "must_be_positive",
      );
    if (!(screwLengthMm > 0))
      simpleError(
        "screwLengthMm",
        "Screw length must be positive.",
        "must_be_positive",
      );
    if (screwLengthMm - 6 <= 0)
      simpleError(
        "screwLengthMm",
        "Screw length must exceed the 6 mm tip clearance.",
        "screw_too_short",
      );
    return {
      pilotHoleDiameterMm: screwDiameterMm * 0.75,
      pilotHoleDepthMm: screwLengthMm - 6,
    };
  },
});
export const runScrewPilotHole = screwPilotHoleTool.execute;
export default screwPilotHoleTool;
