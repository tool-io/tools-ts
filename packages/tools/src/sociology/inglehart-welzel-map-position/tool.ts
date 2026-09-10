import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, finite } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTraditionalSecularCoordinate: number;
  readonly callerVerifiedSurvivalSelfExpressionCoordinate: number;
  readonly callerReferenceTraditionalSecularCoordinate: number;
  readonly callerReferenceSurvivalSelfExpressionCoordinate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedTraditionalSecularCoordinate",
    label: "Caller verified traditional secular coordinate",
    kind: "number",
  },
  {
    id: "callerVerifiedSurvivalSelfExpressionCoordinate",
    label: "Caller verified survival self expression coordinate",
    kind: "number",
  },
  {
    id: "callerReferenceTraditionalSecularCoordinate",
    label: "Caller reference traditional secular coordinate",
    kind: "number",
  },
  {
    id: "callerReferenceSurvivalSelfExpressionCoordinate",
    label: "Caller reference survival self expression coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const x =
      input.callerVerifiedTraditionalSecularCoordinate -
      input.callerReferenceTraditionalSecularCoordinate,
    y =
      input.callerVerifiedSurvivalSelfExpressionCoordinate -
      input.callerReferenceSurvivalSelfExpressionCoordinate;
  finite(x);
  finite(y);
  return {
    signedTraditionalSecularDisplacement: x,
    signedSurvivalSelfExpressionDisplacement: y,
    referencePlaneEuclideanDistance: Math.hypot(x, y),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedTraditionalSecularCoordinate: -1,
    callerVerifiedSurvivalSelfExpressionCoordinate: 2,
    callerReferenceTraditionalSecularCoordinate: 0,
    callerReferenceSurvivalSelfExpressionCoordinate: 0,
  },
  output: {
    result: {
      signedTraditionalSecularDisplacement: -1,
      signedSurvivalSelfExpressionDisplacement: 2,
      referencePlaneEuclideanDistance: 2.23606797749979,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/inglehart-welzel-map-position",
  title: "Inglehart-Welzel Map Position Tool",
  description:
    "Locate actual independently verified Inglehart-Welzel coordinates relative to a declared same-wave reference origin. No invented national scores, cultural superiority, individual values or stable global axes implied.",
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
