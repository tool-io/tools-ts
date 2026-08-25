import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AirDraftWithHeelInput = {
  readonly airDraftUprightMeters: number;
  readonly beamMeters: number;
  readonly heelDeg: number;
};

export type AirDraftWithHeelOutput = {
  readonly effectiveAirDraftMeters: number;
};

export const airDraftWithHeelExample = {
  input: { airDraftUprightMeters: 20, beamMeters: 4, heelDeg: 30 },
  output: { effectiveAirDraftMeters: 18.320508075688775 },
} satisfies ToolExample<AirDraftWithHeelInput, AirDraftWithHeelOutput>;

export const calculateAirDraftWithHeel = (
  input: AirDraftWithHeelInput,
): AirDraftWithHeelOutput => {
  if (input.airDraftUprightMeters <= 0)
    simpleError(
      "airDraftUprightMeters",
      "Upright air draft must be positive.",
      "invalid_input",
    );
  if (input.beamMeters <= 0)
    simpleError("beamMeters", "Beam must be positive.", "invalid_input");
  const radians = (input.heelDeg * Math.PI) / 180;
  return {
    effectiveAirDraftMeters:
      input.airDraftUprightMeters * Math.cos(radians) +
      (input.beamMeters / 2) * Math.sin(radians),
  };
};

export const airDraftWithHeelTool = createSimpleTool({
  calculate: (input) =>
    calculateAirDraftWithHeel(input as unknown as AirDraftWithHeelInput),
  description:
    "Estimate effective air draft while heeled using a simplified rotation about the lower rail. Actual clearance also depends on hull geometry, trim, waves, and the heel pivot.",
  id: "sailing/air-draft-with-heel",
  inputs: [
    {
      description:
        "Highest fixed point of the vessel above the waterline when upright.",
      format: "length-m",
      id: "airDraftUprightMeters",
      kind: "number",
      label: "Upright air draft",
      unit: "m",
    },
    {
      description: "Maximum beam of the hull.",
      format: "length-m",
      id: "beamMeters",
      kind: "number",
      label: "Beam",
      unit: "m",
    },
    {
      description:
        "Angle of heel from upright; the masthead swings toward the span as the deck edge rises.",
      format: "angle-deg",
      id: "heelDeg",
      kind: "number",
      label: "Heel angle",
      maximum: 90,
      minimum: 0,
      unit: "°",
    },
  ],
  outputs: [
    {
      description:
        "Greatest height of any part of the vessel above the water while heeling.",
      format: "length-m",
      id: "effectiveAirDraftMeters",
      kind: "number",
      label: "Effective air draft",
      unit: "m",
    },
  ],
  title: "Air Draft With Heel",
});
export const runAirDraftWithHeel = airDraftWithHeelTool.execute;
export default airDraftWithHeelTool;
