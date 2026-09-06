import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, wrap } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly measuredClockwiseRotationDegrees: number;
  readonly orientationKnown: boolean;
  readonly mirrorKnown: boolean;
  readonly observedMirrored: boolean;
}>;
export type Output = Readonly<{
  readonly orientation: string;
  readonly mirrorStatus: string;
}>;
const inputFields = [
  {
    id: "measuredClockwiseRotationDegrees",
    label: "Measured clockwise rotation degrees",
    kind: "number",
  },
  { id: "orientationKnown", label: "Orientation known", kind: "boolean" },
  { id: "mirrorKnown", label: "Mirror known", kind: "boolean" },
  { id: "observedMirrored", label: "Observed mirrored", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = wrap(input.measuredClockwiseRotationDegrees, 360);
  return {
    orientation: !input.orientationKnown
      ? "unknown"
      : a === 0
        ? "upright"
        : a === 180
          ? "inverted"
          : a === 90 || a === 270
            ? "sideways"
            : "oblique",
    mirrorStatus: !input.mirrorKnown
      ? "unknown"
      : input.observedMirrored
        ? "observed-mirrored"
        : "not-observed-mirrored",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredClockwiseRotationDegrees: 180,
  orientationKnown: true,
  mirrorKnown: true,
  observedMirrored: false,
} satisfies Input;
export const exampleOutput = {
  orientation: "inverted",
  mirrorStatus: "not-observed-mirrored",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/watermark-position-detector",
  title: "Watermark Inverted or Sideways Position Detector",
  description:
    "Describe actual watermark rotation relative to independently established upright reference; mirror evidence separate. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "orientation", label: "Orientation", kind: "string" },
    { id: "mirrorStatus", label: "Mirror status", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      measuredClockwiseRotationDegrees:
        value.measuredClockwiseRotationDegrees as number,
      orientationKnown: value.orientationKnown as boolean,
      mirrorKnown: value.mirrorKnown as boolean,
      observedMirrored: value.observedMirrored as boolean,
    }),
});
export const run = tool.execute;
export default tool;
