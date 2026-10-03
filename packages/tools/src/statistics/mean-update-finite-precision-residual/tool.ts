import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldMean: number;
  readonly count: number;
  readonly value: number;
  readonly suppliedUpdatedMean: number;
};
export type Output = {
  readonly incremental: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldMean: { type: "number" },
    count: { type: "integer", minimum: 0 },
    value: { type: "number" },
    suppliedUpdatedMean: { type: "number" },
  },
  required: ["oldMean", "count", "value", "suppliedUpdatedMean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { incremental: { type: "number" }, residual: { type: "number" } },
  required: ["incremental", "residual"],
} as const;
/** Calculate mean update finite precision residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { oldMean, count, value, suppliedUpdatedMean } = input;
  const compute = (): Output => {
    H.integer(count, 0, Number.MAX_SAFE_INTEGER - 1);
    const incremental = oldMean + (value - oldMean) / (count + 1);
    return { incremental, residual: suppliedUpdatedMean - incremental };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { oldMean: 4, count: 3, value: 8, suppliedUpdatedMean: 5 },
  output: { incremental: 5, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const meanUpdateFinitePrecisionResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/mean-update-finite-precision-residual",
    title: "Mean Update Finite Precision Residual Tool",
    description:
      "Calculate mean update finite precision residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldMean: { type: "number" },
        count: { type: "integer", minimum: 0 },
        value: { type: "number" },
        suppliedUpdatedMean: { type: "number" },
      },
      required: ["oldMean", "count", "value", "suppliedUpdatedMean"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incremental: { type: "number" },
        residual: { type: "number" },
      },
      required: ["incremental", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "oldMean",
          label: "Old Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUpdatedMean",
          label: "Supplied Updated Mean",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "incremental",
          label: "Incremental",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = meanUpdateFinitePrecisionResidualTool.execute;
export default meanUpdateFinitePrecisionResidualTool;
