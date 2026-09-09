import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCandidatePlinthHeightsMeters: readonly number[];
  readonly observedViewerEyeHeightMeters: number;
  readonly observedObjectTargetOffsetAbovePlinthMeters: number;
  readonly observedHorizontalViewingDistanceMeters: number;
  readonly callerPreferredSignedViewingAngleDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCandidatePlinthHeightsMeters",
    label: "Caller candidate plinth heights meters",
    kind: "numberList",
  },
  {
    id: "observedViewerEyeHeightMeters",
    label: "Observed viewer eye height meters",
    kind: "number",
  },
  {
    id: "observedObjectTargetOffsetAbovePlinthMeters",
    label: "Observed object target offset above plinth meters",
    kind: "number",
  },
  {
    id: "observedHorizontalViewingDistanceMeters",
    label: "Observed horizontal viewing distance meters",
    kind: "number",
  },
  {
    id: "callerPreferredSignedViewingAngleDegrees",
    label: "Caller preferred signed viewing angle degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.callerCandidatePlinthHeightsMeters.length)
    simpleError("candidates", "Actual nonempty declared candidates.");
  input.callerCandidatePlinthHeightsMeters.forEach((v) =>
    nonnegative(v, "height"),
  );
  positive(input.observedHorizontalViewingDistanceMeters, "distance");
  nonnegative(input.observedViewerEyeHeightMeters, "eye");
  nonnegative(input.observedObjectTargetOffsetAbovePlinthMeters, "offset");
  if (
    input.callerPreferredSignedViewingAngleDegrees < -90 ||
    input.callerPreferredSignedViewingAngleDegrees > 90
  )
    simpleError("angle", "Preferred signed angle−90to90.");
  const angles = input.callerCandidatePlinthHeightsMeters.map(
      (h) =>
        (Math.atan2(
          input.observedViewerEyeHeightMeters -
            h -
            input.observedObjectTargetOffsetAbovePlinthMeters,
          input.observedHorizontalViewingDistanceMeters,
        ) *
          180) /
        Math.PI,
    ),
    error = angles.map((v) =>
      Math.abs(v - input.callerPreferredSignedViewingAngleDegrees),
    ),
    best = Math.min(...error);
  return {
    bestCallerCandidateHeightsMeters:
      input.callerCandidatePlinthHeightsMeters.filter(
        (_, i) => Math.abs(error[i] - best) <= 1e-12,
      ),
    candidateSignedViewingAnglesDegrees: angles,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCandidatePlinthHeightsMeters: [0.5, 1, 1.5],
    observedViewerEyeHeightMeters: 1.5,
    observedObjectTargetOffsetAbovePlinthMeters: 0.5,
    observedHorizontalViewingDistanceMeters: 2,
    callerPreferredSignedViewingAngleDegrees: 0,
  },
  output: {
    result: {
      bestCallerCandidateHeightsMeters: [1],
      candidateSignedViewingAnglesDegrees: [
        14.036243467926479, 0, -14.036243467926479,
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/plinth-sightline-angle-optimizer",
  title: "Plinth Height Visibility Sightline Angle Optimizer",
  description:
    "Choose all declared plinth-height candidates closest to caller preferred signed 2Deye-above-object viewing angle. Actual viewer/object geometry required, no extrapolated optimum,3Docclusion, universal ideal view or accessible/safe plinth certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
