import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stopDurations: readonly number[] };
export type Output = {
  readonly totalStopTime: number;
  readonly stopCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stopDurations: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["stopDurations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalStopTime: { type: "number" },
    stopCount: { type: "integer" },
  },
  required: ["totalStopTime", "stopCount"],
} as const;
/** Sum explicitly supplied disjoint minor-stop durations without selecting loss classifications or estimating production. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stopDurations } = request;
  const compute = (): Output => {
    stopDurations.forEach((value) => H.domain(value >= 0, "stopDurations"));
    return {
      totalStopTime: stopDurations.reduce((sum, value) => sum + value, 0),
      stopCount: stopDurations.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stopDurations: [2, 3, 1] },
  output: { totalStopTime: 6, stopCount: 3 },
} satisfies ToolExample<Input, Output>;
export const machineMinorstopLossTimeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/machine-minorstop-loss-time-term",
    title: "Machine Minorstop Loss Time Term Tool",
    description:
      "Sum explicitly supplied disjoint minor-stop durations without selecting loss classifications or estimating production.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stopDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["stopDurations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalStopTime: { type: "number" },
        stopCount: { type: "integer" },
      },
      required: ["totalStopTime", "stopCount"],
    },
    ports: {
      inputs: [
        {
          id: "stopDurations",
          label: "Stop Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "totalStopTime",
          label: "Total Stop Time",
          valueType: { type: "number" },
        },
        {
          id: "stopCount",
          label: "Stop Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = machineMinorstopLossTimeTermTool.execute;
export default machineMinorstopLossTimeTermTool;
