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
  readonly actualSnowDepthMeters: number;
  readonly actualMeasuredBulkSnowDensityKgPerM3: number;
  readonly callerWaterDensityKgPerM3: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualSnowDepthMeters",
    label: "Actual snow depth meters",
    kind: "number",
  },
  {
    id: "actualMeasuredBulkSnowDensityKgPerM3",
    label: "Actual measured bulk snow density kg per m3",
    kind: "number",
  },
  {
    id: "callerWaterDensityKgPerM3",
    label: "Caller water density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualSnowDepthMeters, "actualSnowDepthMeters");
  positive(
    input.actualMeasuredBulkSnowDensityKgPerM3,
    "actualMeasuredBulkSnowDensityKgPerM3",
  );
  positive(input.callerWaterDensityKgPerM3, "callerWaterDensityKgPerM3");
  return {
    value:
      (input.actualSnowDepthMeters *
        input.actualMeasuredBulkSnowDensityKgPerM3) /
      input.callerWaterDensityKgPerM3,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualSnowDepthMeters: 1,
    actualMeasuredBulkSnowDensityKgPerM3: 200,
    callerWaterDensityKgPerM3: 1000,
  },
  output: { result: { value: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/swe-from-snow-density",
  title: "SWE From Snow Density Calculator",
  description:
    "Observeddepth-densitysnowSWE,mwaterequivalent,not gravimetriccorearea/massmethod. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
