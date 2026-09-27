import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupPulses: readonly number[];
  readonly secondsPerPulse: number;
};
export type Output = {
  readonly totalPulses: number;
  readonly totalSeconds: number;
  readonly groupSeconds: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupPulses: { type: "array", maxItems: 256, items: { type: "integer" } },
    secondsPerPulse: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["groupPulses", "secondsPerPulse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPulses: { type: "integer" },
    totalSeconds: { type: "number" },
    groupSeconds: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["totalPulses", "totalSeconds", "groupSeconds"],
} as const;
/** Calculate public meter additive group duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupPulses, secondsPerPulse } = request;
  const compute = (): Output => {
    H.domain(groupPulses.length > 0 && groupPulses.every((x) => x > 0));
    H.positive(secondsPerPulse);
    return {
      totalPulses: groupPulses.reduce((a, b) => a + b, 0),
      totalSeconds: groupPulses.reduce((a, b) => a + b, 0) * secondsPerPulse,
      groupSeconds: groupPulses.map((x) => x * secondsPerPulse),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupPulses: [2, 2, 3], secondsPerPulse: 0.25 },
  output: {
    totalPulses: 7,
    totalSeconds: 1.75,
    groupSeconds: [0.5, 0.5, 0.75],
  },
} satisfies ToolExample<Input, Output>;
export const publicMeterAdditiveGroupDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/public-meter-additive-group-duration",
    title: "Public Meter Additive Group Duration Tool",
    description:
      "Calculate public meter additive group duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupPulses: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        secondsPerPulse: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["groupPulses", "secondsPerPulse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPulses: { type: "integer" },
        totalSeconds: { type: "number" },
        groupSeconds: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["totalPulses", "totalSeconds", "groupSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "groupPulses",
          label: "Group Pulses",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "secondsPerPulse",
          label: "Seconds Per Pulse",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalPulses",
          label: "Total Pulses",
          valueType: { type: "integer" },
        },
        {
          id: "totalSeconds",
          label: "Total Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "groupSeconds",
          label: "Group Seconds",
          valueType: { type: "list", items: { type: "number" }, unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicMeterAdditiveGroupDurationTool.execute;
export default publicMeterAdditiveGroupDurationTool;
