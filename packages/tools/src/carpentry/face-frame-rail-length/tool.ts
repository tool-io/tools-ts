import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FaceFrameRailLengthInput = Readonly<{
  readonly overallFrameWidthMm: number;
  readonly leftStileWidthMm: number;
  readonly rightStileWidthMm: number;
}>;
export type FaceFrameRailLengthOutput = Readonly<{
  readonly railLengthMm: number;
}>;

export const calculateFaceFrameRailLength = (
  x: FaceFrameRailLengthInput,
): FaceFrameRailLengthOutput => {
  if (!Number.isFinite(x.overallFrameWidthMm) || x.overallFrameWidthMm < 0)
    simpleError("overallFrameWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.leftStileWidthMm) || x.leftStileWidthMm < 0)
    simpleError("leftStileWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.rightStileWidthMm) || x.rightStileWidthMm < 0)
    simpleError("rightStileWidthMm", "Provide a finite number at least 0.");
  if (!(x.overallFrameWidthMm >= x.leftStileWidthMm + x.rightStileWidthMm))
    simpleError("overallFrameWidthMm", "Frame width must cover both stiles.");
  const railLengthMm =
    x.overallFrameWidthMm - x.leftStileWidthMm - x.rightStileWidthMm;
  if (!Number.isFinite(railLengthMm))
    simpleError("railLengthMm", "The inputs produce an invalid result.");
  return { railLengthMm: Object.is(railLengthMm, -0) ? 0 : railLengthMm };
};

export const example = {
  input: {
    overallFrameWidthMm: 600,
    leftStileWidthMm: 40,
    rightStileWidthMm: 40,
  },
  output: { railLengthMm: 520 },
} satisfies ToolExample<FaceFrameRailLengthInput, FaceFrameRailLengthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/face-frame-rail-length",
  title: "Face Frame Rail Length",
  description:
    "Find butt-jointed face-frame rail length between left and right stiles from overall face-frame width.",
  inputs: [
    {
      id: "overallFrameWidthMm",
      kind: "number",
      label: "Overall face-frame width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "leftStileWidthMm",
      kind: "number",
      label: "Left stile width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "rightStileWidthMm",
      kind: "number",
      label: "Right stile width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "railLengthMm",
      kind: "number",
      label: "Between-stiles rail length",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFaceFrameRailLength({
      overallFrameWidthMm: input.overallFrameWidthMm as number,
      leftStileWidthMm: input.leftStileWidthMm as number,
      rightStileWidthMm: input.rightStileWidthMm as number,
    }),
});
export const faceFrameRailLengthTool = tool;
export const runFaceFrameRailLength = tool.execute;
export default tool;
