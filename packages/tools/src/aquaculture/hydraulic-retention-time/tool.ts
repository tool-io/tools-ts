import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualWorkingWaterVolume: number;
  readonly actualInflowVolumePerHour: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualWorkingWaterVolume",
    label: "Actual working water volume",
    kind: "number",
  },
  {
    id: "actualInflowVolumePerHour",
    label: "Actual inflow volume per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualWorkingWaterVolume, "actualWorkingWaterVolume");
  positive(input.actualInflowVolumePerHour, "actualInflowVolumePerHour");
  return {
    value: input.actualWorkingWaterVolume / input.actualInflowVolumePerHour,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualWorkingWaterVolume: 4, actualInflowVolumePerHour: 2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/hydraulic-retention-time",
  title: "Hydraulic Retention Time Calculator",
  description:
    "Nominal hydraulicretentionhoursV/Qunderactualsteadymatchedvolume/flow, not residence-time distribution or pollutant conversion.",
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
