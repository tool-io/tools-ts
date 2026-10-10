import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableSeats: number;
  readonly partySize: number;
};
export type Output = {
  readonly seatMargin: number;
  readonly fitsByCount: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableSeats: { type: "integer", minimum: 0 },
    partySize: { type: "integer", minimum: 0 },
  },
  required: ["availableSeats", "partySize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seatMargin: { type: "integer" },
    fitsByCount: { type: "boolean" },
  },
  required: ["seatMargin", "fitsByCount"],
} as const;
/** Compare explicit seat and party counts without assessing table layout or deciding seating priority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableSeats, partySize } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(availableSeats) &&
        availableSeats >= 0 &&
        availableSeats <= Number.MAX_SAFE_INTEGER,
      "availableSeats",
    ),
      availableSeats);
    (H.domain(
      Number.isSafeInteger(partySize) &&
        partySize >= 0 &&
        partySize <= Number.MAX_SAFE_INTEGER,
      "partySize",
    ),
      partySize);
    return {
      seatMargin: availableSeats - partySize,
      fitsByCount: availableSeats >= partySize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableSeats: 6, partySize: 4 },
  output: { seatMargin: 2, fitsByCount: true },
} satisfies ToolExample<Input, Output>;
export const restaurantWaitlistPartySizeMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospitality", "business and finance"],
      keywords: ["hospitality", "business and finance"],
    },
    id: "hospitality/restaurant-waitlist-party-size-margin",
    title: "Restaurant Waitlist Party Size Margin",
    description:
      "Compare explicit seat and party counts without assessing table layout or deciding seating priority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableSeats: { type: "integer", minimum: 0 },
        partySize: { type: "integer", minimum: 0 },
      },
      required: ["availableSeats", "partySize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seatMargin: { type: "integer" },
        fitsByCount: { type: "boolean" },
      },
      required: ["seatMargin", "fitsByCount"],
    },
    ports: {
      inputs: [
        {
          id: "availableSeats",
          label: "Available Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "partySize",
          label: "Party Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "seatMargin",
          label: "Seat Margin",
          valueType: { type: "integer" },
        },
        {
          id: "fitsByCount",
          label: "Fits By Count",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = restaurantWaitlistPartySizeMarginTool.execute;
export default restaurantWaitlistPartySizeMarginTool;
