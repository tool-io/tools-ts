import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedMatchedCoordinates: readonly number[];
  readonly callerMatchedResponses: readonly number[];
  readonly queryCoordinate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedMatchedCoordinates",
    label: "Observed matched coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedResponses",
    label: "Caller matched responses",
    kind: "numberList",
  },
  { id: "queryCoordinate", label: "Query coordinate", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const v = curve(
    input.observedMatchedCoordinates,
    input.callerMatchedResponses,
    input.queryCoordinate,
  );
  return { interpolatedResponse: v.value, localMatchedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedMatchedCoordinates: [1, 2, 3],
    callerMatchedResponses: [2, 4, 8],
    queryCoordinate: 2.5,
  },
  output: { result: { interpolatedResponse: 6, localMatchedSlope: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/lookalike-confusion-risk",
  title: "Lookalike Confusion Risk Scorer",
  description:
    "Interpolate independently matched flag-pair lookalike confusion observations. No live survey, universal confusion risk or confidence interval fabricated. Independently matched observer confusion-rate cohort calibration, piecewise-linear with no extrapolation; not a universal threshold or decision.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
