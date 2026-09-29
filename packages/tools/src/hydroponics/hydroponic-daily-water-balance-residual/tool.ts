import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly topup: number;
  readonly drain: number;
  readonly evaporated: number;
  readonly measuredClosing: number;
};
export type Output = {
  readonly expectedClosing: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    topup: { type: "number", minimum: 0 },
    drain: { type: "number", minimum: 0 },
    evaporated: { type: "number", minimum: 0 },
    measuredClosing: { type: "number", minimum: 0 },
  },
  required: ["opening", "topup", "drain", "evaporated", "measuredClosing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedClosing: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedClosing", "residual"],
} as const;
/** Calculate hydroponic daily water balance residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, topup, drain, evaporated, measuredClosing } = request;
  const compute = (): Output => {
    H.domain(
      opening >= 0 &&
        topup >= 0 &&
        drain >= 0 &&
        evaporated >= 0 &&
        measuredClosing >= 0,
    );
    return {
      expectedClosing: opening + topup - drain - evaporated,
      residual: measuredClosing - opening - topup + drain + evaporated,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: 100,
    topup: 20,
    drain: 10,
    evaporated: 5,
    measuredClosing: 103,
  },
  output: { expectedClosing: 105, residual: -2 },
} satisfies ToolExample<Input, Output>;
export const hydroponicDailyWaterBalanceResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydroponics/hydroponic-daily-water-balance-residual",
      title: "Hydroponic Daily Water Balance Residual Tool",
      description:
        "Calculate hydroponic daily water balance residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "number", minimum: 0 },
          topup: { type: "number", minimum: 0 },
          drain: { type: "number", minimum: 0 },
          evaporated: { type: "number", minimum: 0 },
          measuredClosing: { type: "number", minimum: 0 },
        },
        required: [
          "opening",
          "topup",
          "drain",
          "evaporated",
          "measuredClosing",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedClosing: { type: "number" },
          residual: { type: "number" },
        },
        required: ["expectedClosing", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "opening",
            label: "Opening",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "topup",
            label: "Topup",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "drain",
            label: "Drain",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evaporated",
            label: "Evaporated",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredClosing",
            label: "Measured Closing",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedClosing",
            label: "Expected Closing",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = hydroponicDailyWaterBalanceResidualTool.execute;
export default hydroponicDailyWaterBalanceResidualTool;
