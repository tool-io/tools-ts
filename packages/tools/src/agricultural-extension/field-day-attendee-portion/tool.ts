import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subgroupAttendees: number;
  readonly totalAttendees: number;
};
export type Output = {
  readonly attendeeFraction: number;
  readonly otherAttendees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subgroupAttendees: { type: "integer", minimum: 0 },
    totalAttendees: { type: "integer", minimum: 1 },
  },
  required: ["subgroupAttendees", "totalAttendees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendeeFraction: { type: "number" },
    otherAttendees: { type: "integer" },
  },
  required: ["attendeeFraction", "otherAttendees"],
} as const;
/** Normalize an explicit field-day subgroup count to total recorded attendance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subgroupAttendees, totalAttendees } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalAttendees) &&
        totalAttendees >= 1 &&
        totalAttendees <= Number.MAX_SAFE_INTEGER,
      "totalAttendees",
    ),
      totalAttendees);
    (H.domain(
      Number.isSafeInteger(subgroupAttendees) &&
        subgroupAttendees >= 0 &&
        subgroupAttendees <= totalAttendees,
      "subgroupAttendees",
    ),
      subgroupAttendees);
    return {
      attendeeFraction: subgroupAttendees / totalAttendees,
      otherAttendees: totalAttendees - subgroupAttendees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subgroupAttendees: 15, totalAttendees: 60 },
  output: { attendeeFraction: 0.25, otherAttendees: 45 },
} satisfies ToolExample<Input, Output>;
export const fieldDayAttendeeportionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/field-day-attendee-portion",
    title: "Field Day Attendee Portion",
    description:
      "Normalize an explicit field-day subgroup count to total recorded attendance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subgroupAttendees: { type: "integer", minimum: 0 },
        totalAttendees: { type: "integer", minimum: 1 },
      },
      required: ["subgroupAttendees", "totalAttendees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attendeeFraction: { type: "number" },
        otherAttendees: { type: "integer" },
      },
      required: ["attendeeFraction", "otherAttendees"],
    },
    ports: {
      inputs: [
        {
          id: "subgroupAttendees",
          label: "Subgroup Attendees",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalAttendees",
          label: "Total Attendees",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "attendeeFraction",
          label: "Attendee Fraction",
          valueType: { type: "number" },
        },
        {
          id: "otherAttendees",
          label: "Other Attendees",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldDayAttendeeportionTool.execute;
export default fieldDayAttendeeportionTool;
