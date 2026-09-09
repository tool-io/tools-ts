import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualEffectiveNormalStress: number;
  readonly callerMatchedJointCompressiveStrength: number;
  readonly callerIndependentlyAssessedJrc: number;
  readonly callerMatchedResidualFrictionAngleDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEffectiveNormalStress",
    label: "Actual effective normal stress",
    kind: "number",
  },
  {
    id: "callerMatchedJointCompressiveStrength",
    label: "Caller matched joint compressive strength",
    kind: "number",
  },
  {
    id: "callerIndependentlyAssessedJrc",
    label: "Caller independently assessed jrc",
    kind: "number",
  },
  {
    id: "callerMatchedResidualFrictionAngleDegrees",
    label: "Caller matched residual friction angle degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualEffectiveNormalStress, "normalstress");
  positive(input.callerMatchedJointCompressiveStrength, "JCS");
  nonnegative(input.callerIndependentlyAssessedJrc, "JRC");
  if (
    input.actualEffectiveNormalStress >
    input.callerMatchedJointCompressiveStrength
  )
    simpleError("stress", "Declared empirical branch σn≤JCS.");
  const a =
    input.callerIndependentlyAssessedJrc *
      Math.log10(
        input.callerMatchedJointCompressiveStrength /
          input.actualEffectiveNormalStress,
      ) +
    input.callerMatchedResidualFrictionAngleDegrees;
  if (a < 0 || a >= 90) simpleError("angle", "Empirical friction angle0≤a<90.");
  return {
    conditionalBartonBandisPeakShearStress:
      input.actualEffectiveNormalStress * Math.tan((a * Math.PI) / 180),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEffectiveNormalStress: 1,
    callerMatchedJointCompressiveStrength: 10,
    callerIndependentlyAssessedJrc: 5,
    callerMatchedResidualFrictionAngleDegrees: 20,
  },
  output: {
    result: { conditionalBartonBandisPeakShearStress: 0.4663076581549986 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/joint-shear-strength-barton-bandis",
  title: "Geology Joint Shear Strength Barton Bandis Calculator",
  description:
    "Ideal joint peak shear \u03c4=\u03c3n tan[JRC log10(JCS/\u03c3n)+\u03c6r], same stress units. Actual scale/weathering/normal stress applicability and JRC/JCSindependent; valid angle0\u2013<90\u00b0, not residual shear or structural safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
