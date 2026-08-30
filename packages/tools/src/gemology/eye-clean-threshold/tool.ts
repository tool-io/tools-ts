import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly apparentInclusionWidthMm: number;
  readonly viewingDistanceMm: number;
  readonly callerAngularResolutionArcminutes: number;
}>;
export type Output = Readonly<{
  readonly apparentInclusionAngularWidthArcminutes: number;
  readonly callerResolutionWidthThresholdMm: number;
  readonly aboveCallerAngularResolution: boolean;
}>;
const inputFields = [
  {
    id: "apparentInclusionWidthMm",
    label: "Apparent inclusion width mm",
    kind: "number",
  },
  { id: "viewingDistanceMm", label: "Viewing distance mm", kind: "number" },
  {
    id: "callerAngularResolutionArcminutes",
    label: "Caller angular resolution arcminutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.viewingDistanceMm, "viewingDistanceMm");
  positive(
    input.callerAngularResolutionArcminutes,
    "callerAngularResolutionArcminutes",
  );
  nonnegative(input.apparentInclusionWidthMm, "apparentInclusionWidthMm");
  if (input.callerAngularResolutionArcminutes >= 10800)
    simpleError("resolution", "Angular threshold must be below 180 degrees.");
  const angle =
      ((2 *
        Math.atan2(
          input.apparentInclusionWidthMm,
          2 * input.viewingDistanceMm,
        ) *
        180) /
        Math.PI) *
      60,
    threshold =
      2 *
      input.viewingDistanceMm *
      Math.tan(
        ((input.callerAngularResolutionArcminutes / 60) * Math.PI) / 360,
      );
  return {
    apparentInclusionAngularWidthArcminutes: angle,
    callerResolutionWidthThresholdMm: threshold,
    aboveCallerAngularResolution:
      angle > input.callerAngularResolutionArcminutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  apparentInclusionWidthMm: 0.1,
  viewingDistanceMm: 300,
  callerAngularResolutionArcminutes: 1,
} satisfies Input;
export const exampleOutput = {
  apparentInclusionAngularWidthArcminutes: 1.1459155796513172,
  callerResolutionWidthThresholdMm: 0.08726646321506103,
  aboveCallerAngularResolution: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/eye-clean-threshold",
  title: "Eye-Clean Threshold Size",
  description:
    "Compare already apparent inclusion width to caller visual angular-resolution model; real contrast, lighting, depth/refraction and observer acuity remain unmodeled, so this is not an eye-clean certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentInclusionAngularWidthArcminutes",
      label: "Apparent inclusion angular width arcminutes",
      kind: "number",
    },
    {
      id: "callerResolutionWidthThresholdMm",
      label: "Caller resolution width threshold mm",
      kind: "number",
    },
    {
      id: "aboveCallerAngularResolution",
      label: "Above caller angular resolution",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      apparentInclusionWidthMm: value.apparentInclusionWidthMm as number,
      viewingDistanceMm: value.viewingDistanceMm as number,
      callerAngularResolutionArcminutes:
        value.callerAngularResolutionArcminutes as number,
    }),
});
export const run = tool.execute;
export default tool;
