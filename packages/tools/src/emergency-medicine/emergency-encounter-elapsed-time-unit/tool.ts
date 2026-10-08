import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly elapsedSeconds: number };
export type Output = { readonly elapsedMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedSeconds: { type: "number", minimum: 0 } },
  required: ["elapsedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedMinutes: { type: "number" } },
  required: ["elapsedMinutes"],
} as const;
/** Convert supplied emergency encounter elapsed seconds to minutes without clinical timing thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedSeconds } = request;
  const compute = (): Output => {
    H.domain(elapsedSeconds >= 0, "elapsedSeconds");
    return { elapsedMinutes: elapsedSeconds / 60 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedSeconds: 150 },
  output: { elapsedMinutes: 2.5 },
} satisfies ToolExample<Input, Output>;
export const emergencyEncounterElapsedTimeUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/emergency-encounter-elapsed-time-unit",
    title: "Emergency Encounter Elapsed Time Unit Tool",
    description:
      "Convert supplied emergency encounter elapsed seconds to minutes without clinical timing thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsedSeconds: { type: "number", minimum: 0 } },
      required: ["elapsedSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsedMinutes: { type: "number" } },
      required: ["elapsedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = emergencyEncounterElapsedTimeUnitTool.execute;
export default emergencyEncounterElapsedTimeUnitTool;
