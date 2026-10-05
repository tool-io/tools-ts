import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousMeterHours: number;
  readonly currentMeterHours: number;
};
export type Output = { readonly serviceHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousMeterHours: { type: "number", minimum: 0 },
    currentMeterHours: { type: "number" },
  },
  required: ["previousMeterHours", "currentMeterHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { serviceHours: { type: "number" } },
  required: ["serviceHours"],
} as const;
/** Record service-hour meter change for non-combat administrative equipment without maintenance or operational recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousMeterHours, currentMeterHours } = request;
  const compute = (): Output => {
    H.domain(
      previousMeterHours >= 0 && currentMeterHours >= previousMeterHours,
      "previousMeterHours",
    );
    return { serviceHours: currentMeterHours - previousMeterHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousMeterHours: 120, currentMeterHours: 157.5 },
  output: { serviceHours: 37.5 },
} satisfies ToolExample<Input, Output>;
export const nonCombatEquipmentServiceHourDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/non-combat-equipment-service-hour-delta",
    title: "Non Combat Equipment Service Hour Delta Tool",
    description:
      "Record service-hour meter change for non-combat administrative equipment without maintenance or operational recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousMeterHours: { type: "number", minimum: 0 },
        currentMeterHours: { type: "number" },
      },
      required: ["previousMeterHours", "currentMeterHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { serviceHours: { type: "number" } },
      required: ["serviceHours"],
    },
    ports: {
      inputs: [
        {
          id: "previousMeterHours",
          label: "Previous Meter Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentMeterHours",
          label: "Current Meter Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "serviceHours",
          label: "Service Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nonCombatEquipmentServiceHourDeltaTool.execute;
export default nonCombatEquipmentServiceHourDeltaTool;
