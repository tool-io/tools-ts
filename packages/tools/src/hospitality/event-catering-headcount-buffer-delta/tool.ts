import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly confirmedGuests: number;
  readonly bufferFraction: number;
};
export type Output = {
  readonly rawBuffer: number;
  readonly extraCovers: number;
  readonly plannedCovers: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    confirmedGuests: { type: "integer", minimum: 0 },
    bufferFraction: { type: "number", minimum: 0 },
  },
  required: ["confirmedGuests", "bufferFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawBuffer: { type: "number" },
    extraCovers: { type: "integer" },
    plannedCovers: { type: "integer" },
  },
  required: ["rawBuffer", "extraCovers", "plannedCovers"],
} as const;
/** Apply a caller-selected catering buffer and round extra covers upward to whole people. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { confirmedGuests, bufferFraction } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(confirmedGuests) &&
        confirmedGuests >= 0 &&
        confirmedGuests <= Number.MAX_SAFE_INTEGER,
      "confirmedGuests",
    ),
      confirmedGuests);
    H.domain(bufferFraction >= 0, "bufferFraction");
    return {
      rawBuffer: confirmedGuests * bufferFraction,
      extraCovers: Math.ceil(confirmedGuests * bufferFraction),
      plannedCovers:
        confirmedGuests + Math.ceil(confirmedGuests * bufferFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { confirmedGuests: 83, bufferFraction: 0.1 },
  output: { rawBuffer: 8.3, extraCovers: 9, plannedCovers: 92 },
} satisfies ToolExample<Input, Output>;
export const eventCateringHeadcountBufferDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/event-catering-headcount-buffer-delta",
    title: "Event Catering Headcount Buffer Delta Tool",
    description:
      "Apply a caller-selected catering buffer and round extra covers upward to whole people.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        confirmedGuests: { type: "integer", minimum: 0 },
        bufferFraction: { type: "number", minimum: 0 },
      },
      required: ["confirmedGuests", "bufferFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawBuffer: { type: "number" },
        extraCovers: { type: "integer" },
        plannedCovers: { type: "integer" },
      },
      required: ["rawBuffer", "extraCovers", "plannedCovers"],
    },
    ports: {
      inputs: [
        {
          id: "confirmedGuests",
          label: "Confirmed Guests",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bufferFraction",
          label: "Buffer Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawBuffer", label: "Raw Buffer", valueType: { type: "number" } },
        {
          id: "extraCovers",
          label: "Extra Covers",
          valueType: { type: "integer" },
        },
        {
          id: "plannedCovers",
          label: "Planned Covers",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = eventCateringHeadcountBufferDeltaTool.execute;
export default eventCateringHeadcountBufferDeltaTool;
