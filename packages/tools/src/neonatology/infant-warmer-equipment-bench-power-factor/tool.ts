import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputWatts: number;
  readonly standbyWatts: number;
  readonly heatWatts: number;
  readonly seconds: number;
};
export type Output = {
  readonly netWatts: number;
  readonly efficiency: number;
  readonly inputJ: number;
  readonly heatJ: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputWatts: { type: "number" },
    standbyWatts: { type: "number", minimum: 0 },
    heatWatts: { type: "number", minimum: 0 },
    seconds: { type: "number" },
  },
  required: ["inputWatts", "standbyWatts", "heatWatts", "seconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netWatts: { type: "number" },
    efficiency: { type: "number" },
    inputJ: { type: "number" },
    heatJ: { type: "number" },
  },
  required: ["netWatts", "efficiency", "inputJ", "heatJ"],
} as const;
/** Compute supplied bench energy and standby-subtracted efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputWatts, standbyWatts, heatWatts, seconds } = request;
  const compute = (): Output => {
    H.domain(
      inputWatts > standbyWatts &&
        standbyWatts >= 0 &&
        heatWatts >= 0 &&
        seconds >= 0,
      "inputWatts",
    );
    return {
      netWatts: inputWatts - standbyWatts,
      efficiency: heatWatts / (inputWatts - standbyWatts),
      inputJ: inputWatts * seconds,
      heatJ: heatWatts * seconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputWatts: 200, standbyWatts: 20, heatWatts: 90, seconds: 60 },
  output: { netWatts: 180, efficiency: 0.5, inputJ: 12000, heatJ: 5400 },
} satisfies ToolExample<Input, Output>;
export const infantWarmerEquipmentBenchPowerFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "neonatology/infant-warmer-equipment-bench-power-factor",
      title: "Infant Warmer Equipment Bench Power Factor Tool",
      description:
        "Compute supplied bench energy and standby-subtracted efficiency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inputWatts: { type: "number" },
          standbyWatts: { type: "number", minimum: 0 },
          heatWatts: { type: "number", minimum: 0 },
          seconds: { type: "number" },
        },
        required: ["inputWatts", "standbyWatts", "heatWatts", "seconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netWatts: { type: "number" },
          efficiency: { type: "number" },
          inputJ: { type: "number" },
          heatJ: { type: "number" },
        },
        required: ["netWatts", "efficiency", "inputJ", "heatJ"],
      },
      ports: {
        inputs: [
          {
            id: "inputWatts",
            label: "Input Watts",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "standbyWatts",
            label: "Standby Watts",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "heatWatts",
            label: "Heat Watts",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "seconds",
            label: "Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "netWatts", label: "Net Watts", valueType: { type: "number" } },
          {
            id: "efficiency",
            label: "Efficiency",
            valueType: { type: "number" },
          },
          { id: "inputJ", label: "Input J", valueType: { type: "number" } },
          { id: "heatJ", label: "Heat J", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = infantWarmerEquipmentBenchPowerFactorTool.execute;
export default infantWarmerEquipmentBenchPowerFactorTool;
