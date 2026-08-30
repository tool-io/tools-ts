import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DovetailSpacingInput = Readonly<{
  readonly jointWidthMm: number;
  readonly tailCount: number;
  readonly endPinWidthMm: number;
  readonly interiorPinWidthMm: number;
}>;
export type DovetailSpacingOutput = Readonly<{
  readonly tailWidthMm: number;
  readonly centerPitchMm: number;
}>;

export const calculateDovetailSpacing = (
  x: DovetailSpacingInput,
): DovetailSpacingOutput => {
  if (!Number.isFinite(x.jointWidthMm) || x.jointWidthMm < 0)
    simpleError("jointWidthMm", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.tailCount) || x.tailCount < 2)
    simpleError("tailCount", "Provide a safe integer at least 2.");
  if (!Number.isFinite(x.endPinWidthMm) || x.endPinWidthMm < 0)
    simpleError("endPinWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.interiorPinWidthMm) || x.interiorPinWidthMm < 0)
    simpleError("interiorPinWidthMm", "Provide a finite number at least 0.");
  if (!(
    x.tailCount >= 2 &&
    x.jointWidthMm >
      2 * x.endPinWidthMm + (x.tailCount - 1) * x.interiorPinWidthMm
  ))
    simpleError("jointWidthMm", "Joint width must leave positive tail width.");
  const tailWidthMm =
    (x.jointWidthMm -
      2 * x.endPinWidthMm -
      (x.tailCount - 1) * x.interiorPinWidthMm) /
    x.tailCount;
  if (!Number.isFinite(tailWidthMm))
    simpleError("tailWidthMm", "The inputs produce an invalid result.");
  const centerPitchMm =
    (x.jointWidthMm -
      2 * x.endPinWidthMm -
      (x.tailCount - 1) * x.interiorPinWidthMm) /
      x.tailCount +
    x.interiorPinWidthMm;
  if (!Number.isFinite(centerPitchMm))
    simpleError("centerPitchMm", "The inputs produce an invalid result.");
  return {
    tailWidthMm: Object.is(tailWidthMm, -0) ? 0 : tailWidthMm,
    centerPitchMm: Object.is(centerPitchMm, -0) ? 0 : centerPitchMm,
  };
};

export const example = {
  input: {
    jointWidthMm: 100,
    tailCount: 4,
    endPinWidthMm: 5,
    interiorPinWidthMm: 10,
  },
  output: { tailWidthMm: 15, centerPitchMm: 25 },
} satisfies ToolExample<DovetailSpacingInput, DovetailSpacingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dovetail-spacing",
  title: "Dovetail Spacing",
  description:
    "Lay out equal dovetail tails between two end pins and equal interior pins; report tail width and center pitch.",
  inputs: [
    {
      id: "jointWidthMm",
      kind: "number",
      label: "Joint width",
      unit: "mm",
      minimum: 0,
    },
    { id: "tailCount", kind: "integer", label: "Tail count", minimum: 2 },
    {
      id: "endPinWidthMm",
      kind: "number",
      label: "Each end pin width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "interiorPinWidthMm",
      kind: "number",
      label: "Interior pin width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "tailWidthMm",
      kind: "number",
      label: "Equal tail width",
      unit: "mm",
    },
    {
      id: "centerPitchMm",
      kind: "number",
      label: "Tail center pitch",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDovetailSpacing({
      jointWidthMm: input.jointWidthMm as number,
      tailCount: input.tailCount as number,
      endPinWidthMm: input.endPinWidthMm as number,
      interiorPinWidthMm: input.interiorPinWidthMm as number,
    }),
});
export const dovetailSpacingTool = tool;
export const runDovetailSpacing = tool.execute;
export default tool;
