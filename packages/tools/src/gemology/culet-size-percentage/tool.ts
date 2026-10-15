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
  readonly actualCuletDiameter: number;
  readonly actualGirdleDiameter: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualCuletDiameter", label: "Actual culet diameter", kind: "number" },
  {
    id: "actualGirdleDiameter",
    label: "Actual girdle diameter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualCuletDiameter, "actualCuletDiameter");
  positive(input.actualGirdleDiameter, "actualGirdleDiameter");
  return {
    value: (100 * input.actualCuletDiameter) / input.actualGirdleDiameter,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualCuletDiameter: 2, actualGirdleDiameter: 4 },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/culet-size-percentage",
  title: "Culet Size Percentage Calculator",
  description:
    "Observedculet/girdlediameterpercentage Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
