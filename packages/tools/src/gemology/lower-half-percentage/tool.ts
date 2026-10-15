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
  readonly actualLowerHalfFacetProjectedLength: number;
  readonly callerIndependentlyDefinedGirdleToCuletReferenceLength: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualLowerHalfFacetProjectedLength",
    label: "Actual lower half facet projected length",
    kind: "number",
  },
  {
    id: "callerIndependentlyDefinedGirdleToCuletReferenceLength",
    label: "Caller independently defined girdle to culet reference length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.actualLowerHalfFacetProjectedLength,
    "actualLowerHalfFacetProjectedLength",
  );
  positive(
    input.callerIndependentlyDefinedGirdleToCuletReferenceLength,
    "callerIndependentlyDefinedGirdleToCuletReferenceLength",
  );
  return {
    value:
      (100 * input.actualLowerHalfFacetProjectedLength) /
      input.callerIndependentlyDefinedGirdleToCuletReferenceLength,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualLowerHalfFacetProjectedLength: 2,
    callerIndependentlyDefinedGirdleToCuletReferenceLength: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/lower-half-percentage",
  title: "Lower Half Facet Percentage Calculator",
  description:
    "Observedlowerhalffacetprojectedlength/independentgirdletoculet referencepercentage Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
