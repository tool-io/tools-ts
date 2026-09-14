import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualPavilionDepth: number;
  readonly actualGirdleDiameter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualPavilionDepth", label: "Actual pavilion depth", kind: "number" },
  {
    id: "actualGirdleDiameter",
    label: "Actual girdle diameter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualPavilionDepth, "actualPavilionDepth");
  positive(input.actualGirdleDiameter, "actualGirdleDiameter");
  return {
    value: (100 * input.actualPavilionDepth) / input.actualGirdleDiameter,
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
  input: { actualPavilionDepth: 2, actualGirdleDiameter: 4 },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/pavilion-depth-percentage",
  title: "Pavilion Depth Percentage Calculator",
  description:
    "Observedpaviliondepth/girdlediameterpercentage,not pavilionangle Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
