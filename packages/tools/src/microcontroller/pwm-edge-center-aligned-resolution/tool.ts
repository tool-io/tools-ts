import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodTicks: number;
  readonly centerAligned: boolean;
};
export type Output = {
  readonly edgeTicks: number;
  readonly countStates: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodTicks: { type: "integer", minimum: 1, maximum: 2147483647 },
    centerAligned: { type: "boolean" },
  },
  required: ["periodTicks", "centerAligned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeTicks: { type: "integer" },
    countStates: { type: "integer" },
  },
  required: ["edgeTicks", "countStates"],
} as const;
/** Compare ideal up-down and edge-aligned timer cycles for a caller-supplied top count; endpoint hardware conventions may differ. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { periodTicks, centerAligned } = input;
  const compute = (): Output => {
    H.integer(periodTicks, 1, 2147483647);
    return {
      edgeTicks: periodTicks * (centerAligned ? 2 : 1),
      countStates: periodTicks + 1,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { periodTicks: 100, centerAligned: true },
  output: { edgeTicks: 200, countStates: 101 },
} satisfies ToolExample<Input, Output>;
export const pwmEdgeCenterAlignedResolutionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/pwm-edge-center-aligned-resolution",
    title: "PWM Edge Center Aligned Resolution Tool",
    description:
      "Compare ideal up-down and edge-aligned timer cycles for a caller-supplied top count; endpoint hardware conventions may differ.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodTicks: { type: "integer", minimum: 1, maximum: 2147483647 },
        centerAligned: { type: "boolean" },
      },
      required: ["periodTicks", "centerAligned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeTicks: { type: "integer" },
        countStates: { type: "integer" },
      },
      required: ["edgeTicks", "countStates"],
    },
    ports: {
      inputs: [
        {
          id: "periodTicks",
          label: "Period Ticks",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "centerAligned",
          label: "Center Aligned",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "edgeTicks",
          label: "Edge Ticks",
          valueType: { type: "integer" },
        },
        {
          id: "countStates",
          label: "Count States",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pwmEdgeCenterAlignedResolutionTool.execute;
export default pwmEdgeCenterAlignedResolutionTool;
