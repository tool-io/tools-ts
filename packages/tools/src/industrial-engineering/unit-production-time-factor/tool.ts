import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly batchTime: number; readonly batchUnits: number };
export type Output = { readonly timePerUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batchTime: { type: "number", minimum: 0 },
    batchUnits: { type: "integer", minimum: 1 },
  },
  required: ["batchTime", "batchUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { timePerUnit: { type: "number" } },
  required: ["timePerUnit"],
} as const;
/** Calculate unit production time factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batchTime, batchUnits } = request;
  const compute = (): Output => {
    H.domain(batchTime >= 0);
    H.integer(batchUnits, 1);
    return { timePerUnit: batchTime / batchUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { batchTime: 60, batchUnits: 12 },
  output: { timePerUnit: 5 },
} satisfies ToolExample<Input, Output>;
export const unitProductionTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/unit-production-time-factor",
    title: "Unit Production Time Factor Tool",
    description:
      "Calculate unit production time factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        batchTime: { type: "number", minimum: 0 },
        batchUnits: { type: "integer", minimum: 1 },
      },
      required: ["batchTime", "batchUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { timePerUnit: { type: "number" } },
      required: ["timePerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "batchTime",
          label: "Batch Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "batchUnits",
          label: "Batch Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "timePerUnit",
          label: "Time Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = unitProductionTimeFactorTool.execute;
export default unitProductionTimeFactorTool;
