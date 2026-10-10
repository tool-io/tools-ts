import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalMinutes: number;
  readonly departureMinutes: number;
  readonly openingMinutes: number;
  readonly closingMinutes: number;
};
export type Output = { readonly overlapMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalMinutes: { type: "number" },
    departureMinutes: { type: "number" },
    openingMinutes: { type: "number" },
    closingMinutes: { type: "number" },
  },
  required: [
    "arrivalMinutes",
    "departureMinutes",
    "openingMinutes",
    "closingMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapMinutes: { type: "number" } },
  required: ["overlapMinutes"],
} as const;
/** Intersect an explicit visit interval with one opening interval on a common elapsed-minute timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalMinutes, departureMinutes, openingMinutes, closingMinutes } =
    request;
  const compute = (): Output => {
    H.domain(
      departureMinutes >= arrivalMinutes && closingMinutes >= openingMinutes,
      "departureMinutes",
    );
    return {
      overlapMinutes: Math.max(
        0,
        Math.min(departureMinutes, closingMinutes) -
          Math.max(arrivalMinutes, openingMinutes),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    arrivalMinutes: 500,
    departureMinutes: 600,
    openingMinutes: 540,
    closingMinutes: 1020,
  },
  output: { overlapMinutes: 60 },
} satisfies ToolExample<Input, Output>;
export const serviceAccessOpeningHourOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/service-access-opening-hour-overlap",
    title: "Service Access Opening Hour Overlap",
    description:
      "Intersect an explicit visit interval with one opening interval on a common elapsed-minute timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalMinutes: { type: "number" },
        departureMinutes: { type: "number" },
        openingMinutes: { type: "number" },
        closingMinutes: { type: "number" },
      },
      required: [
        "arrivalMinutes",
        "departureMinutes",
        "openingMinutes",
        "closingMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapMinutes: { type: "number" } },
      required: ["overlapMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalMinutes",
          label: "Arrival Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "departureMinutes",
          label: "Departure Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingMinutes",
          label: "Opening Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closingMinutes",
          label: "Closing Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapMinutes",
          label: "Overlap Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = serviceAccessOpeningHourOverlapTool.execute;
export default serviceAccessOpeningHourOverlapTool;
