import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualBuildingLongPlanDimension: number;
  readonly actualBuildingShortPlanDimension: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBuildingLongPlanDimension",
    label: "Actual building long plan dimension",
    kind: "number",
  },
  {
    id: "actualBuildingShortPlanDimension",
    label: "Actual building short plan dimension",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualBuildingLongPlanDimension,
    "actualBuildingLongPlanDimension",
  );
  positive(
    input.actualBuildingShortPlanDimension,
    "actualBuildingShortPlanDimension",
  );
  if (
    input.actualBuildingLongPlanDimension <
    input.actualBuildingShortPlanDimension
  )
    simpleError("plan", "L≥W.");
  return {
    value:
      input.actualBuildingLongPlanDimension -
      input.actualBuildingShortPlanDimension,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBuildingLongPlanDimension: 10,
    actualBuildingShortPlanDimension: 4,
  },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/ridge-length-hip",
  title: "Hip Ridge Length Calculator",
  description:
    "Ideal symmetric45degree hip rectangular roof ridgeplanlengthL\u2212W, common pitch, equal overhang datum andL\u2265W; not actual ridge vent usable length. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
