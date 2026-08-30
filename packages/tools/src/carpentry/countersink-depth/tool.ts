import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CountersinkDepthInput = Readonly<{
  readonly headDiameterMm: number;
  readonly pilotDiameterMm: number;
  readonly includedAngleDegrees: number;
}>;
export type CountersinkDepthOutput = Readonly<{
  readonly countersinkDepthMm: number;
}>;

export const calculateCountersinkDepth = (
  x: CountersinkDepthInput,
): CountersinkDepthOutput => {
  if (!Number.isFinite(x.headDiameterMm) || x.headDiameterMm < 0)
    simpleError("headDiameterMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pilotDiameterMm) || x.pilotDiameterMm < 0)
    simpleError("pilotDiameterMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.includedAngleDegrees) || x.includedAngleDegrees < 0)
    simpleError("includedAngleDegrees", "Provide a finite number at least 0.");
  if (!(
    x.headDiameterMm >= x.pilotDiameterMm &&
    x.includedAngleDegrees > 0 &&
    x.includedAngleDegrees < 180
  ))
    simpleError(
      "input",
      "Head must cover pilot and angle must lie between 0 and 180 degrees.",
    );
  const countersinkDepthMm =
    (x.headDiameterMm - x.pilotDiameterMm) /
    (2 * Math.tan((x.includedAngleDegrees * Math.PI) / 360));
  if (!Number.isFinite(countersinkDepthMm))
    simpleError("countersinkDepthMm", "The inputs produce an invalid result.");
  return {
    countersinkDepthMm: Object.is(countersinkDepthMm, -0)
      ? 0
      : countersinkDepthMm,
  };
};

export const example = {
  input: { headDiameterMm: 8, pilotDiameterMm: 4, includedAngleDegrees: 90 },
  output: { countersinkDepthMm: 2.0000000000000004 },
} satisfies ToolExample<CountersinkDepthInput, CountersinkDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/countersink-depth",
  title: "Countersink Depth",
  description:
    "Calculate conical countersink depth between pilot-hole diameter and screw-head diameter from included countersink angle.",
  inputs: [
    {
      id: "headDiameterMm",
      kind: "number",
      label: "Screw head diameter",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "pilotDiameterMm",
      kind: "number",
      label: "Pilot opening diameter",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "includedAngleDegrees",
      kind: "number",
      label: "Countersink included angle",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "countersinkDepthMm",
      kind: "number",
      label: "Conical depth",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateCountersinkDepth({
      headDiameterMm: input.headDiameterMm as number,
      pilotDiameterMm: input.pilotDiameterMm as number,
      includedAngleDegrees: input.includedAngleDegrees as number,
    }),
});
export const countersinkDepthTool = tool;
export const runCountersinkDepth = tool.execute;
export default tool;
