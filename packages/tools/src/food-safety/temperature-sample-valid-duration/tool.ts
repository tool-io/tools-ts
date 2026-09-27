import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly valid: readonly boolean[];
};
export type Output = {
  readonly validDuration: number;
  readonly recordedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["durations", "valid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validDuration: { type: "number" },
    recordedDuration: { type: "number" },
  },
  required: ["validDuration", "recordedDuration"],
} as const;
/** Sum caller-classified sample durations without choosing temperature limits or certifying food safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, valid } = request;
  const compute = (): Output => {
    H.sameLength(durations, valid);
    H.domain(durations.every((x) => x >= 0));
    return {
      validDuration: durations.reduce((s, x, i) => s + (valid[i] ? x : 0), 0),
      recordedDuration: durations.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { durations: [2, 3, 4], valid: [true, false, true] },
  output: { validDuration: 6, recordedDuration: 9 },
} satisfies ToolExample<Input, Output>;
export const temperatureSampleValidDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/temperature-sample-valid-duration",
    title: "Temperature Sample Valid Duration Tool",
    description:
      "Sum caller-classified sample durations without choosing temperature limits or certifying food safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["durations", "valid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validDuration: { type: "number" },
        recordedDuration: { type: "number" },
      },
      required: ["validDuration", "recordedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validDuration",
          label: "Valid Duration",
          valueType: { type: "number" },
        },
        {
          id: "recordedDuration",
          label: "Recorded Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = temperatureSampleValidDurationTool.execute;
export default temperatureSampleValidDurationTool;
