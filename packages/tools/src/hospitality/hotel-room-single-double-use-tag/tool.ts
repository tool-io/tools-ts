import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bookingId: string;
  readonly useCategory: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookingId: { type: "string", maxLength: 8192, minLength: 1 },
    useCategory: {
      type: "string",
      maxLength: 8192,
      enum: ["single", "double", "other", "unspecified"],
    },
  },
  required: ["bookingId", "useCategory"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded hotel room-use category without changing occupancy limits or rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bookingId, useCategory } = request;
  const compute = (): Output => {
    H.domain(bookingId.length > 0, "bookingId");
    H.domain(
      ["single", "double", "other", "unspecified"].includes(useCategory),
      "useCategory",
    );
    return { label: bookingId + " [" + useCategory + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bookingId: "B17", useCategory: "double" },
  output: { label: "B17 [double]" },
} satisfies ToolExample<Input, Output>;
export const hotelRoomSingleDoubleUseTagTool = H.defineSchemaCalculation<
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
    id: "hospitality/hotel-room-single-double-use-tag",
    title: "Hotel Room Single Double Use Tag",
    description:
      "Label an explicitly recorded hotel room-use category without changing occupancy limits or rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bookingId: { type: "string", maxLength: 8192, minLength: 1 },
        useCategory: {
          type: "string",
          maxLength: 8192,
          enum: ["single", "double", "other", "unspecified"],
        },
      },
      required: ["bookingId", "useCategory"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "bookingId",
          label: "Booking Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "useCategory",
          label: "Use Category",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hotelRoomSingleDoubleUseTagTool.execute;
export default hotelRoomSingleDoubleUseTagTool;
