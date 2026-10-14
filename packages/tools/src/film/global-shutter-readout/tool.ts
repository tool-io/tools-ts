import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualTransferredPixelCount: number;
  readonly actualMeasuredSustainedReadoutPixelRate: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualTransferredPixelCount",
    label: "Actual transferred pixel count",
    kind: "number",
  },
  {
    id: "actualMeasuredSustainedReadoutPixelRate",
    label: "Actual measured sustained readout pixel rate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  bounded(
    input.actualTransferredPixelCount,
    "actualTransferredPixelCount",
    0,
    1000000,
  );
  positive(
    input.actualMeasuredSustainedReadoutPixelRate,
    "actualMeasuredSustainedReadoutPixelRate",
  );
  return {
    value:
      input.actualTransferredPixelCount /
      input.actualMeasuredSustainedReadoutPixelRate,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTransferredPixelCount: 10,
    actualMeasuredSustainedReadoutPixelRate: 5,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/global-shutter-readout",
  title: "Global Shutter Readout Calculator",
  description:
    "Actual global-shutter stored frame pixel transfer duration count/observed throughput, not simultaneous exposure time or row-by-row rolling readout skew.",
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
