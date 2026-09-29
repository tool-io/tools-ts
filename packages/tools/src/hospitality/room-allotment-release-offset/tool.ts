import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly releaseDay: number;
  readonly arrivalDay: number;
  readonly suppliedLeadDays: number;
};
export type Output = {
  readonly actualLeadDays: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    releaseDay: { type: "integer" },
    arrivalDay: { type: "integer" },
    suppliedLeadDays: { type: "integer", minimum: 0 },
  },
  required: ["releaseDay", "arrivalDay", "suppliedLeadDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualLeadDays: { type: "integer" },
    margin: { type: "integer" },
  },
  required: ["actualLeadDays", "margin"],
} as const;
/** Compare supplied allotment release timing to a caller-defined lead requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { releaseDay, arrivalDay, suppliedLeadDays } = request;
  const compute = (): Output => {
    H.integer(suppliedLeadDays, 0);
    return {
      actualLeadDays: arrivalDay - releaseDay,
      margin: arrivalDay - releaseDay - suppliedLeadDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { releaseDay: 100, arrivalDay: 130, suppliedLeadDays: 20 },
  output: { actualLeadDays: 30, margin: 10 },
} satisfies ToolExample<Input, Output>;
export const roomAllotmentReleaseOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/room-allotment-release-offset",
    title: "Room Allotment Release Offset Tool",
    description:
      "Compare supplied allotment release timing to a caller-defined lead requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        releaseDay: { type: "integer" },
        arrivalDay: { type: "integer" },
        suppliedLeadDays: { type: "integer", minimum: 0 },
      },
      required: ["releaseDay", "arrivalDay", "suppliedLeadDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualLeadDays: { type: "integer" },
        margin: { type: "integer" },
      },
      required: ["actualLeadDays", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "releaseDay",
          label: "Release Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "arrivalDay",
          label: "Arrival Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedLeadDays",
          label: "Supplied Lead Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "actualLeadDays",
          label: "Actual Lead Days",
          valueType: { type: "integer" },
        },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = roomAllotmentReleaseOffsetTool.execute;
export default roomAllotmentReleaseOffsetTool;
