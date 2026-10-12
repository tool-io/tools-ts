import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualInflowVolumePerHour: number;
  readonly actualWorkingWaterVolume: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualInflowVolumePerHour",
    label: "Actual inflow volume per hour",
    kind: "number",
  },
  {
    id: "actualWorkingWaterVolume",
    label: "Actual working water volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualInflowVolumePerHour, "actualInflowVolumePerHour");
  positive(input.actualWorkingWaterVolume, "actualWorkingWaterVolume");
  return {
    value: input.actualInflowVolumePerHour / input.actualWorkingWaterVolume,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualInflowVolumePerHour: 2, actualWorkingWaterVolume: 4 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/turnover-rate",
  title: "Turnover Rate Calculator",
  description:
    "Actual hydraulicturnoverperhourQ/V, not animals biological turnover or reciprocalHRT.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
