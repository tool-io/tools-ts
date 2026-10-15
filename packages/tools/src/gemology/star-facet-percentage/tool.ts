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
  readonly actualStarFacetProjectedLength: number;
  readonly callerIndependentlyDefinedTableToGirdleRadialReference: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualStarFacetProjectedLength",
    label: "Actual star facet projected length",
    kind: "number",
  },
  {
    id: "callerIndependentlyDefinedTableToGirdleRadialReference",
    label: "Caller independently defined table to girdle radial reference",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.actualStarFacetProjectedLength,
    "actualStarFacetProjectedLength",
  );
  positive(
    input.callerIndependentlyDefinedTableToGirdleRadialReference,
    "callerIndependentlyDefinedTableToGirdleRadialReference",
  );
  return {
    value:
      (100 * input.actualStarFacetProjectedLength) /
      input.callerIndependentlyDefinedTableToGirdleRadialReference,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualStarFacetProjectedLength: 2,
    callerIndependentlyDefinedTableToGirdleRadialReference: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/star-facet-percentage",
  title: "Star Facet Length Percentage Calculator",
  description:
    "Observedstarfacetprojectedlength/independenttabletogirdle referencepercentage Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
