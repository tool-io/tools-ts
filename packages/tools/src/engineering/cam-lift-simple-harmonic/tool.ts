import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CamLiftSimpleHarmonicInput = Readonly<{
  readonly liftMillimeters: number;
  readonly positionDegrees: number;
  readonly riseDegrees: number;
}>;
export type CamLiftSimpleHarmonicOutput = Readonly<{
  readonly displacementMillimeters: number;
}>;

export const calculateCamLiftSimpleHarmonic = (
  x: CamLiftSimpleHarmonicInput,
): CamLiftSimpleHarmonicOutput => {
  if (!Number.isFinite(x.liftMillimeters) || x.liftMillimeters < 0)
    simpleError("liftMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.positionDegrees) || x.positionDegrees < 0)
    simpleError("positionDegrees", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.riseDegrees) || x.riseDegrees < 0)
    simpleError("riseDegrees", "Provide a finite number at least 0.");
  if (x.positionDegrees > x.riseDegrees)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const displacementMillimeters =
    (x.liftMillimeters *
      (1 - Math.cos((Math.PI * x.positionDegrees) / x.riseDegrees))) /
    2;
  if (!Number.isFinite(displacementMillimeters))
    simpleError(
      "displacementMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    displacementMillimeters: Object.is(displacementMillimeters, -0)
      ? 0
      : displacementMillimeters,
  };
};

export const example = {
  input: { liftMillimeters: 10, positionDegrees: 45, riseDegrees: 90 },
  output: { displacementMillimeters: 4.999999999999999 },
} satisfies ToolExample<
  CamLiftSimpleHarmonicInput,
  CamLiftSimpleHarmonicOutput
>;

export const tool = createSimpleTool({
  id: "engineering/cam-lift-simple-harmonic",
  title: "Cam Lift Simple Harmonic",
  description:
    "Simple-harmonic cam follower displacement over a specified rise angle, with zero at start and full lift at end.",
  inputs: [
    {
      id: "liftMillimeters",
      kind: "number",
      label: "Lift Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "positionDegrees",
      kind: "number",
      label: "Position Degrees",
      unit: "°",
      minimum: 0,
    },
    {
      id: "riseDegrees",
      kind: "number",
      label: "Rise Degrees",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "displacementMillimeters",
      kind: "number",
      label: "Displacement Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateCamLiftSimpleHarmonic({
      liftMillimeters: input.liftMillimeters as number,
      positionDegrees: input.positionDegrees as number,
      riseDegrees: input.riseDegrees as number,
    }),
});
export const camLiftSimpleHarmonicTool = tool;
export const runCamLiftSimpleHarmonic = tool.execute;
export default tool;
