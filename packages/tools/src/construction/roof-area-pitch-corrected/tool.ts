import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoofAreaPitchCorrectedInput = Readonly<{
  readonly planAreaM2: number;
  readonly pitchDegrees: number;
}>;
export type RoofAreaPitchCorrectedOutput = Readonly<{
  readonly roofAreaM2: number;
}>;

export const calculateRoofAreaPitchCorrected = (
  x: RoofAreaPitchCorrectedInput,
): RoofAreaPitchCorrectedOutput => {
  if (!Number.isFinite(x.planAreaM2) || x.planAreaM2 < 0)
    simpleError("planAreaM2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pitchDegrees) || x.pitchDegrees < 0)
    simpleError("pitchDegrees", "Provide a finite number at least 0.");
  if (!(x.pitchDegrees < 90))
    simpleError("pitchDegrees", "Pitch must be below 90 degrees.");
  const roofAreaM2 = x.planAreaM2 / Math.cos((x.pitchDegrees * Math.PI) / 180);
  if (!Number.isFinite(roofAreaM2))
    simpleError("roofAreaM2", "The inputs produce an invalid result.");
  return { roofAreaM2: Object.is(roofAreaM2, -0) ? 0 : roofAreaM2 };
};

export const example = {
  input: { planAreaM2: 100, pitchDegrees: 30 },
  output: { roofAreaM2: 115.47005383792515 },
} satisfies ToolExample<
  RoofAreaPitchCorrectedInput,
  RoofAreaPitchCorrectedOutput
>;

export const tool = createSimpleTool({
  id: "construction/roof-area-pitch-corrected",
  title: "Roof Area Pitch Corrected",
  description:
    "Convert horizontal roof plan area to sloped area for a uniform roof pitch; excludes overhangs and openings.",
  inputs: [
    {
      id: "planAreaM2",
      kind: "number",
      label: "Horizontal plan area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "pitchDegrees",
      kind: "number",
      label: "Pitch angle",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "roofAreaM2", kind: "number", label: "Sloped roof area", unit: "m²" },
  ],
  calculate: (input) =>
    calculateRoofAreaPitchCorrected({
      planAreaM2: input.planAreaM2 as number,
      pitchDegrees: input.pitchDegrees as number,
    }),
});
export const roofAreaPitchCorrectedTool = tool;
export const runRoofAreaPitchCorrected = tool.execute;
export default tool;
