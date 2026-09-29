import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preparedMass: number;
  readonly unservedMass: number;
  readonly plateWasteMass: number;
  readonly attendees: number;
};
export type Output = {
  readonly wasteMass: number;
  readonly wastePerAttendee: number;
  readonly consumedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preparedMass: { type: "number" },
    unservedMass: { type: "number", minimum: 0 },
    plateWasteMass: { type: "number", minimum: 0 },
    attendees: { type: "integer", minimum: 1 },
  },
  required: ["preparedMass", "unservedMass", "plateWasteMass", "attendees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wasteMass: { type: "number" },
    wastePerAttendee: { type: "number" },
    consumedMass: { type: "number" },
  },
  required: ["wasteMass", "wastePerAttendee", "consumedMass"],
} as const;
/** Calculate buffet food waste per attendee from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preparedMass, unservedMass, plateWasteMass, attendees } = request;
  const compute = (): Output => {
    H.integer(attendees, 1);
    H.domain(
      unservedMass >= 0 &&
        plateWasteMass >= 0 &&
        preparedMass >= unservedMass + plateWasteMass,
    );
    return {
      wasteMass: unservedMass + plateWasteMass,
      wastePerAttendee: (unservedMass + plateWasteMass) / attendees,
      consumedMass: preparedMass - unservedMass - plateWasteMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preparedMass: 100,
    unservedMass: 10,
    plateWasteMass: 5,
    attendees: 50,
  },
  output: { wasteMass: 15, wastePerAttendee: 0.3, consumedMass: 85 },
} satisfies ToolExample<Input, Output>;
export const buffetFoodWastePerAttendeeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/buffet-food-waste-per-attendee",
    title: "Buffet Food Waste Per Attendee Tool",
    description:
      "Calculate buffet food waste per attendee from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preparedMass: { type: "number" },
        unservedMass: { type: "number", minimum: 0 },
        plateWasteMass: { type: "number", minimum: 0 },
        attendees: { type: "integer", minimum: 1 },
      },
      required: ["preparedMass", "unservedMass", "plateWasteMass", "attendees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wasteMass: { type: "number" },
        wastePerAttendee: { type: "number" },
        consumedMass: { type: "number" },
      },
      required: ["wasteMass", "wastePerAttendee", "consumedMass"],
    },
    ports: {
      inputs: [
        {
          id: "preparedMass",
          label: "Prepared Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unservedMass",
          label: "Unserved Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plateWasteMass",
          label: "Plate Waste Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "attendees",
          label: "Attendees",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "wasteMass", label: "Waste Mass", valueType: { type: "number" } },
        {
          id: "wastePerAttendee",
          label: "Waste Per Attendee",
          valueType: { type: "number" },
        },
        {
          id: "consumedMass",
          label: "Consumed Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = buffetFoodWastePerAttendeeTool.execute;
export default buffetFoodWastePerAttendeeTool;
