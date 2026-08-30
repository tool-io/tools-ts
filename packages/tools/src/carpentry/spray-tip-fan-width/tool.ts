import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SprayTipFanWidthInput = Readonly<{
  readonly standoffDistanceMm: number;
  readonly fullFanAngleDegrees: number;
}>;
export type SprayTipFanWidthOutput = Readonly<{
  readonly geometricFanWidthMm: number;
}>;

export const calculateSprayTipFanWidth = (
  x: SprayTipFanWidthInput,
): SprayTipFanWidthOutput => {
  if (!Number.isFinite(x.standoffDistanceMm) || x.standoffDistanceMm < 0)
    simpleError("standoffDistanceMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.fullFanAngleDegrees) || x.fullFanAngleDegrees < 0)
    simpleError("fullFanAngleDegrees", "Provide a finite number at least 0.");
  if (!(x.fullFanAngleDegrees < 180))
    simpleError("fullFanAngleDegrees", "Fan angle must be below 180 degrees.");
  const geometricFanWidthMm =
    2 *
    x.standoffDistanceMm *
    Math.tan((x.fullFanAngleDegrees * Math.PI) / 360);
  if (!Number.isFinite(geometricFanWidthMm))
    simpleError("geometricFanWidthMm", "The inputs produce an invalid result.");
  return {
    geometricFanWidthMm: Object.is(geometricFanWidthMm, -0)
      ? 0
      : geometricFanWidthMm,
  };
};

export const example = {
  input: { standoffDistanceMm: 300, fullFanAngleDegrees: 60 },
  output: { geometricFanWidthMm: 346.41016151377545 },
} satisfies ToolExample<SprayTipFanWidthInput, SprayTipFanWidthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/spray-tip-fan-width",
  title: "Spray Tip Fan Width",
  description:
    "Estimate spray fan width on a flat surface from standoff distance and full included fan angle, ignoring edge feathering.",
  inputs: [
    {
      id: "standoffDistanceMm",
      kind: "number",
      label: "Standoff distance",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "fullFanAngleDegrees",
      kind: "number",
      label: "Full fan angle",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "geometricFanWidthMm",
      kind: "number",
      label: "Geometric fan width",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateSprayTipFanWidth({
      standoffDistanceMm: input.standoffDistanceMm as number,
      fullFanAngleDegrees: input.fullFanAngleDegrees as number,
    }),
});
export const sprayTipFanWidthTool = tool;
export const runSprayTipFanWidth = tool.execute;
export default tool;
