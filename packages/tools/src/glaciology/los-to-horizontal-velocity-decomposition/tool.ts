import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMatchedLosVelocities: readonly number[];
  readonly callerHorizontalProjectionRows: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMatchedLosVelocities",
    label: "Actual matched los velocities",
    kind: "numberList",
  },
  {
    id: "callerHorizontalProjectionRows",
    label: "Caller horizontal projection rows",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = input.callerHorizontalProjectionRows;
  if (
    a.length !== 2 ||
    a.some((r) => r.length !== 2) ||
    input.actualMatchedLosVelocities.length !== 2
  )
    simpleError(
      "geometry",
      "TwoindependenthorizontalLOSrowsandobservations,verticalvelocityseparatelyremoved.",
    );
  const d = a[0][0] * a[1][1] - a[0][1] * a[1][0];
  if (Math.abs(d) < 1e-8)
    simpleError("geometry", "Resolvedinvertibleindependentlookgeometry.");
  return {
    eastVelocity:
      (input.actualMatchedLosVelocities[0] * a[1][1] -
        input.actualMatchedLosVelocities[1] * a[0][1]) /
      d,
    northVelocity:
      (a[0][0] * input.actualMatchedLosVelocities[1] -
        a[1][0] * input.actualMatchedLosVelocities[0]) /
      d,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualMatchedLosVelocities: [1, 2],
    callerHorizontalProjectionRows: [
      [1, 0],
      [0, 1],
    ],
  },
  output: { result: { eastVelocity: 1, northVelocity: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/los-to-horizontal-velocity-decomposition",
  title: "LOS to Horizontal Velocity Decomposition Calculator",
  description:
    "Twoactualindependentlookhorizontal2\u00d72LOSdecomposition,verticalcomponent independentlyremoved,not solve2componentsfromoneLOS;no geodeticframeconversion. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
