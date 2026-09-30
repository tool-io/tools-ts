import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualIdle: number;
  readonly requiredIdle: number;
};
export type Output = {
  readonly slack: number;
  readonly meetsRequirement: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualIdle: { type: "number", minimum: 0 },
    requiredIdle: { type: "number", minimum: 0 },
  },
  required: ["actualIdle", "requiredIdle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slack: { type: "number" },
    meetsRequirement: { type: "boolean" },
  },
  required: ["slack", "meetsRequirement"],
} as const;
/** Compare supplied idle timing with an explicit device requirement in the same time units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualIdle, requiredIdle } = request;
  const compute = (): Output => {
    H.domain(actualIdle >= 0 && requiredIdle >= 0);
    return {
      slack: actualIdle - requiredIdle,
      meetsRequirement: actualIdle >= requiredIdle,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualIdle: 5, requiredIdle: 3 },
  output: { slack: 2, meetsRequirement: true },
} satisfies ToolExample<Input, Output>;
export const spiChipSelectIdleSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/spi-chip-select-idle-slack",
    title: "SPI Chip Select Idle Slack Tool",
    description:
      "Compare supplied idle timing with an explicit device requirement in the same time units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualIdle: { type: "number", minimum: 0 },
        requiredIdle: { type: "number", minimum: 0 },
      },
      required: ["actualIdle", "requiredIdle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slack: { type: "number" },
        meetsRequirement: { type: "boolean" },
      },
      required: ["slack", "meetsRequirement"],
    },
    ports: {
      inputs: [
        {
          id: "actualIdle",
          label: "Actual Idle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredIdle",
          label: "Required Idle",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        {
          id: "meetsRequirement",
          label: "Meets Requirement",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = spiChipSelectIdleSlackTool.execute;
export default spiChipSelectIdleSlackTool;
