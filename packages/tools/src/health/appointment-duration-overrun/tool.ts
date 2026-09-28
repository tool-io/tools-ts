import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedDuration: number;
  readonly actualDuration: number;
  readonly gracePeriod: number;
};
export type Output = { readonly overrun: number; readonly beyondGrace: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedDuration: { type: "number", minimum: 0 },
    actualDuration: { type: "number", minimum: 0 },
    gracePeriod: { type: "number", minimum: 0 },
  },
  required: ["plannedDuration", "actualDuration", "gracePeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overrun: { type: "number" }, beyondGrace: { type: "number" } },
  required: ["overrun", "beyondGrace"],
} as const;
/** Administrative appointment duration comparison with an explicit grace interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedDuration, actualDuration, gracePeriod } = request;
  const compute = (): Output => {
    H.domain(plannedDuration >= 0 && actualDuration >= 0 && gracePeriod >= 0);
    return {
      overrun: actualDuration - plannedDuration,
      beyondGrace: Math.max(0, actualDuration - plannedDuration - gracePeriod),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedDuration: 30, actualDuration: 45, gracePeriod: 5 },
  output: { overrun: 15, beyondGrace: 10 },
} satisfies ToolExample<Input, Output>;
export const appointmentDurationOverrunTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/appointment-duration-overrun",
    title: "Appointment Duration Overrun Tool",
    description:
      "Administrative appointment duration comparison with an explicit grace interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedDuration: { type: "number", minimum: 0 },
        actualDuration: { type: "number", minimum: 0 },
        gracePeriod: { type: "number", minimum: 0 },
      },
      required: ["plannedDuration", "actualDuration", "gracePeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overrun: { type: "number" },
        beyondGrace: { type: "number" },
      },
      required: ["overrun", "beyondGrace"],
    },
    ports: {
      inputs: [
        {
          id: "plannedDuration",
          label: "Planned Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualDuration",
          label: "Actual Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gracePeriod",
          label: "Grace Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overrun", label: "Overrun", valueType: { type: "number" } },
        {
          id: "beyondGrace",
          label: "Beyond Grace",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = appointmentDurationOverrunTool.execute;
export default appointmentDurationOverrunTool;
