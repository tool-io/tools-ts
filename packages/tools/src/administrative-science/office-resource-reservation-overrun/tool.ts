import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reservedMinutes: number;
  readonly actualMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reservedMinutes: { type: "number" },
    actualMinutes: { type: "number" },
  },
  required: ["reservedMinutes", "actualMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Measure actual minus reserved office-resource minutes in the same time basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reservedMinutes, actualMinutes } = request;
  const compute = (): Output => {
    return { signedGap: actualMinutes - reservedMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reservedMinutes: 12, actualMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const officeResourceReservationOverrunTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/office-resource-reservation-overrun",
    title: "Office Resource Reservation Overrun",
    description:
      "Measure actual minus reserved office-resource minutes in the same time basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reservedMinutes: { type: "number" },
        actualMinutes: { type: "number" },
      },
      required: ["reservedMinutes", "actualMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "reservedMinutes",
          label: "Reserved Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualMinutes",
          label: "Actual Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = officeResourceReservationOverrunTool.execute;
export default officeResourceReservationOverrunTool;
