import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDisjointCellAreas: readonly number[];
  readonly actualCellElevationRates: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualDisjointCellAreas",
    label: "Actual disjoint cell areas",
    kind: "numberList",
  },
  {
    id: "actualCellElevationRates",
    label: "Actual cell elevation rates",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualDisjointCellAreas.length)
    simpleError("actualDisjointCellAreas", "Actualnonemptyobservations.");
  input.actualDisjointCellAreas.forEach((v) =>
    nonnegative(v, "actualDisjointCellAreas"),
  );
  if (!input.actualCellElevationRates.length)
    simpleError("actualCellElevationRates", "Actualnonemptyobservations.");
  aligned(
    input.actualDisjointCellAreas,
    input.actualCellElevationRates,
    "cells",
  );
  return {
    value: sum(
      input.actualDisjointCellAreas.map(
        (v, i) => v * input.actualCellElevationRates[i],
      ),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualDisjointCellAreas: [1, 2], actualCellElevationRates: [2, -2] },
  output: { result: { value: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/volume-change-dhdt-area-integration",
  title: "Volume Change DHDT Area Integration Calculator",
  description:
    "Signedareaintegral\u03a3cellA\u00d7actualdh/dt,nonoverlapping completecoverage,not volume-areaallometry. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
