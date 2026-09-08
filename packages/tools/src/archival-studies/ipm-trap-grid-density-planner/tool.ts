import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlySurveyedRoomWidthMeters: number;
  readonly callerIndependentlySurveyedRoomLengthMeters: number;
  readonly callerPermittedMaximumGridSpacingMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlySurveyedRoomWidthMeters",
    label: "Caller independently surveyed room width meters",
    kind: "number",
  },
  {
    id: "callerIndependentlySurveyedRoomLengthMeters",
    label: "Caller independently surveyed room length meters",
    kind: "number",
  },
  {
    id: "callerPermittedMaximumGridSpacingMeters",
    label: "Caller permitted maximum grid spacing meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerIndependentlySurveyedRoomWidthMeters, "width");
  positive(input.callerIndependentlySurveyedRoomLengthMeters, "length");
  positive(input.callerPermittedMaximumGridSpacingMeters, "spacing");
  const x =
      Math.ceil(
        input.callerIndependentlySurveyedRoomWidthMeters /
          input.callerPermittedMaximumGridSpacingMeters,
      ) + 1,
    y =
      Math.ceil(
        input.callerIndependentlySurveyedRoomLengthMeters /
          input.callerPermittedMaximumGridSpacingMeters,
      ) + 1;
  if (x * y > 1000000) simpleError("grid", "Bounded conceptual grid.");
  return {
    conditionalRectangularGridColumnCount: x,
    conditionalRectangularGridRowCount: y,
    conditionalGridTrapCount: x * y,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlySurveyedRoomWidthMeters: 10,
    callerIndependentlySurveyedRoomLengthMeters: 20,
    callerPermittedMaximumGridSpacingMeters: 5,
  },
  output: {
    result: {
      conditionalRectangularGridColumnCount: 3,
      conditionalRectangularGridRowCount: 5,
      conditionalGridTrapCount: 15,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/ipm-trap-grid-density-planner",
  title: "Integrated Pest Management Trap Grid Density Planner",
  description:
    "Conditional full-boundary rectangular monitoring grid at caller maximum spacing. Real traps require actual obstruction/access/pest/collection review; no universal IPM density, eradication efficacy or safe placement inferred.",
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
