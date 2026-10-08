import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startHour: number;
  readonly endHour: number;
  readonly downtimeHours: number;
};
export type Output = { readonly operatingHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startHour: { type: "number" },
    endHour: { type: "number" },
    downtimeHours: { type: "number", minimum: 0 },
  },
  required: ["startHour", "endHour", "downtimeHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { operatingHours: { type: "number" } },
  required: ["operatingHours"],
} as const;
/** Subtract explicit nonoverlapping downtime from a trap deployment interval on one elapsed-hour timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startHour, endHour, downtimeHours } = request;
  const compute = (): Output => {
    H.domain(endHour >= startHour, "endHour");
    H.domain(
      downtimeHours >= 0 && downtimeHours <= endHour - startHour,
      "downtimeHours",
    );
    return { operatingHours: endHour - startHour - downtimeHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startHour: 8, endHour: 32, downtimeHours: 3 },
  output: { operatingHours: 21 },
} satisfies ToolExample<Input, Output>;
export const insectTrapOperatingHourCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["entomology", "biology"],
      keywords: ["entomology", "biology"],
    },
    id: "entomology/insect-trap-operating-hour-count",
    title: "Insect Trap Operating Hour Count",
    description:
      "Subtract explicit nonoverlapping downtime from a trap deployment interval on one elapsed-hour timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startHour: { type: "number" },
        endHour: { type: "number" },
        downtimeHours: { type: "number", minimum: 0 },
      },
      required: ["startHour", "endHour", "downtimeHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { operatingHours: { type: "number" } },
      required: ["operatingHours"],
    },
    ports: {
      inputs: [
        {
          id: "startHour",
          label: "Start Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endHour",
          label: "End Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "downtimeHours",
          label: "Downtime Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "operatingHours",
          label: "Operating Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectTrapOperatingHourCountTool.execute;
export default insectTrapOperatingHourCountTool;
