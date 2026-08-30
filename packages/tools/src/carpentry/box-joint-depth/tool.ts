import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoxJointDepthInput = Readonly<{
  readonly matingBoardThicknessMm: number;
  readonly protrusionAllowanceMm: number;
}>;
export type BoxJointDepthOutput = Readonly<{
  readonly fingerCutDepthMm: number;
}>;

export const calculateBoxJointDepth = (
  x: BoxJointDepthInput,
): BoxJointDepthOutput => {
  if (
    !Number.isFinite(x.matingBoardThicknessMm) ||
    x.matingBoardThicknessMm < 0
  )
    simpleError(
      "matingBoardThicknessMm",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.protrusionAllowanceMm) || x.protrusionAllowanceMm < 0)
    simpleError("protrusionAllowanceMm", "Provide a finite number at least 0.");
  const fingerCutDepthMm = x.matingBoardThicknessMm + x.protrusionAllowanceMm;
  if (!Number.isFinite(fingerCutDepthMm))
    simpleError("fingerCutDepthMm", "The inputs produce an invalid result.");
  return {
    fingerCutDepthMm: Object.is(fingerCutDepthMm, -0) ? 0 : fingerCutDepthMm,
  };
};

export const example = {
  input: { matingBoardThicknessMm: 18, protrusionAllowanceMm: 1 },
  output: { fingerCutDepthMm: 19 },
} satisfies ToolExample<BoxJointDepthInput, BoxJointDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/box-joint-depth",
  title: "Box Joint Depth",
  description:
    "Size box-joint fingers from mating board thickness plus deliberate protrusion before flushing.",
  inputs: [
    {
      id: "matingBoardThicknessMm",
      kind: "number",
      label: "Mating board thickness",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "protrusionAllowanceMm",
      kind: "number",
      label: "Pre-flush protrusion",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fingerCutDepthMm",
      kind: "number",
      label: "Finger cut depth",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateBoxJointDepth({
      matingBoardThicknessMm: input.matingBoardThicknessMm as number,
      protrusionAllowanceMm: input.protrusionAllowanceMm as number,
    }),
});
export const boxJointDepthTool = tool;
export const runBoxJointDepth = tool.execute;
export default tool;
