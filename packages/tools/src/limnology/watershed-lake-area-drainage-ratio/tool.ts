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
  readonly actualIndependentlyDelineatedWatershedArea: number;
  readonly actualMeasuredLakeArea: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyDelineatedWatershedArea",
    label: "Actual independently delineated watershed area",
    kind: "number",
  },
  {
    id: "actualMeasuredLakeArea",
    label: "Actual measured lake area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.actualIndependentlyDelineatedWatershedArea,
    "actualIndependentlyDelineatedWatershedArea",
  );
  positive(input.actualMeasuredLakeArea, "actualMeasuredLakeArea");
  return {
    value:
      input.actualIndependentlyDelineatedWatershedArea /
      input.actualMeasuredLakeArea,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlyDelineatedWatershedArea: 10,
    actualMeasuredLakeArea: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/watershed-lake-area-drainage-ratio",
  title: "Watershed Lake Area Drainage Ratio Calculator",
  description:
    "Actualexternaldelineatedtributarywatershed/lakearea drainageratio,sameunits/not infernutrientload or delineategeodesy. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
