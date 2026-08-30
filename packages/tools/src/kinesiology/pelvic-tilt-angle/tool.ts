import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly psisAboveAsisCm: number;
  readonly horizontalSeparationCm: number;
  readonly anteriorThresholdDegrees: number;
}>;
export type Output = Readonly<{
  readonly tiltDegrees: number;
  readonly anteriorTiltFlag: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.horizontalSeparationCm <= 0 || input.anteriorThresholdDegrees < 0)
    simpleError(
      "horizontalSeparationCm",
      "Positive horizontal pelvic landmark span and nonnegative threshold required.",
    );
  const tiltDegrees =
    (Math.atan2(input.psisAboveAsisCm, input.horizontalSeparationCm) * 180) /
    Math.PI;
  return {
    tiltDegrees,
    anteriorTiltFlag: tiltDegrees > input.anteriorThresholdDegrees,
  };
};
export const exampleInput = {
  psisAboveAsisCm: 1,
  horizontalSeparationCm: 1,
  anteriorThresholdDegrees: 10,
} satisfies Input;
export const exampleOutput = {
  tiltDegrees: 45,
  anteriorTiltFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/pelvic-tilt-angle",
  title: "Pelvic Tilt Angle",
  description:
    "Estimate sagittal tilt from PSIS-above-ASIS rise and horizontal landmark separation.",
  inputs: [
    { id: "psisAboveAsisCm", label: "Psis above asis cm", kind: "number" },
    {
      id: "horizontalSeparationCm",
      label: "Horizontal separation cm",
      kind: "number",
    },
    {
      id: "anteriorThresholdDegrees",
      label: "Anterior threshold degrees",
      kind: "number",
    },
  ],
  outputs: [
    { id: "tiltDegrees", label: "Tilt degrees", kind: "number" },
    { id: "anteriorTiltFlag", label: "Anterior tilt flag", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      psisAboveAsisCm: value.psisAboveAsisCm as number,
      horizontalSeparationCm: value.horizontalSeparationCm as number,
      anteriorThresholdDegrees: value.anteriorThresholdDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
