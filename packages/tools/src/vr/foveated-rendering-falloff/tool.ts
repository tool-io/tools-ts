import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualEccentricityDegrees: number;
  readonly callerIndependentInnerRadiusDegrees: number;
  readonly callerIndependentOuterRadiusDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEccentricityDegrees",
    label: "Actual eccentricity degrees",
    kind: "number",
  },
  {
    id: "callerIndependentInnerRadiusDegrees",
    label: "Caller independent inner radius degrees",
    kind: "number",
  },
  {
    id: "callerIndependentOuterRadiusDegrees",
    label: "Caller independent outer radius degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualEccentricityDegrees, "actualEccentricityDegrees");
  nonnegative(
    input.callerIndependentInnerRadiusDegrees,
    "callerIndependentInnerRadiusDegrees",
  );
  positive(
    input.callerIndependentOuterRadiusDegrees,
    "callerIndependentOuterRadiusDegrees",
  );
  if (
    input.callerIndependentOuterRadiusDegrees <=
    input.callerIndependentInnerRadiusDegrees
  )
    simpleError("radii", "Actualouter>inner.");
  return {
    value: Math.max(
      0,
      Math.min(
        1,
        (input.actualEccentricityDegrees -
          input.callerIndependentInnerRadiusDegrees) /
          (input.callerIndependentOuterRadiusDegrees -
            input.callerIndependentInnerRadiusDegrees),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEccentricityDegrees: 2,
    callerIndependentInnerRadiusDegrees: 1,
    callerIndependentOuterRadiusDegrees: 3,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/foveated-rendering-falloff",
  title: "Foveated Rendering Falloff Calculator",
  description:
    "Explicit linear clamped foveation falloff coordinate between independent angular radii, not model human acuity or anti-aliasing kernel selection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
