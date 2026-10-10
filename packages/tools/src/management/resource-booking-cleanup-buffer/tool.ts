import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bookingStart: number;
  readonly bookingEnd: number;
  readonly suppliedSetupBefore: number;
  readonly suppliedCleanupAfter: number;
};
export type Output = {
  readonly blockedStart: number;
  readonly blockedEnd: number;
  readonly totalBlockedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookingStart: { type: "number" },
    bookingEnd: { type: "number" },
    suppliedSetupBefore: { type: "number", minimum: 0 },
    suppliedCleanupAfter: { type: "number", minimum: 0 },
  },
  required: [
    "bookingStart",
    "bookingEnd",
    "suppliedSetupBefore",
    "suppliedCleanupAfter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockedStart: { type: "number" },
    blockedEnd: { type: "number" },
    totalBlockedDuration: { type: "number" },
  },
  required: ["blockedStart", "blockedEnd", "totalBlockedDuration"],
} as const;
/** Expand an explicit resource booking by supplied setup and cleanup durations without resolving booking conflicts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    bookingStart,
    bookingEnd,
    suppliedSetupBefore,
    suppliedCleanupAfter,
  } = request;
  const compute = (): Output => {
    H.domain(bookingEnd >= bookingStart, "bookingEnd");
    H.domain(
      suppliedSetupBefore >= 0 && suppliedCleanupAfter >= 0,
      "suppliedSetupBefore",
    );
    return {
      blockedStart: bookingStart - suppliedSetupBefore,
      blockedEnd: bookingEnd + suppliedCleanupAfter,
      totalBlockedDuration:
        bookingEnd - bookingStart + suppliedSetupBefore + suppliedCleanupAfter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bookingStart: 100,
    bookingEnd: 160,
    suppliedSetupBefore: 10,
    suppliedCleanupAfter: 15,
  },
  output: { blockedStart: 90, blockedEnd: 175, totalBlockedDuration: 85 },
} satisfies ToolExample<Input, Output>;
export const resourceBookingCleanupBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/resource-booking-cleanup-buffer",
    title: "Resource Booking Cleanup Buffer",
    description:
      "Expand an explicit resource booking by supplied setup and cleanup durations without resolving booking conflicts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bookingStart: { type: "number" },
        bookingEnd: { type: "number" },
        suppliedSetupBefore: { type: "number", minimum: 0 },
        suppliedCleanupAfter: { type: "number", minimum: 0 },
      },
      required: [
        "bookingStart",
        "bookingEnd",
        "suppliedSetupBefore",
        "suppliedCleanupAfter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockedStart: { type: "number" },
        blockedEnd: { type: "number" },
        totalBlockedDuration: { type: "number" },
      },
      required: ["blockedStart", "blockedEnd", "totalBlockedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "bookingStart",
          label: "Booking Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bookingEnd",
          label: "Booking End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSetupBefore",
          label: "Supplied Setup Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCleanupAfter",
          label: "Supplied Cleanup After",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "blockedStart",
          label: "Blocked Start",
          valueType: { type: "number" },
        },
        {
          id: "blockedEnd",
          label: "Blocked End",
          valueType: { type: "number" },
        },
        {
          id: "totalBlockedDuration",
          label: "Total Blocked Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = resourceBookingCleanupBufferTool.execute;
export default resourceBookingCleanupBufferTool;
