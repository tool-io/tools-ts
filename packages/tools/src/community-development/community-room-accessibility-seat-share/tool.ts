import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly designatedAccessibleSeats: number;
  readonly totalSeats: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    designatedAccessibleSeats: { type: "number", minimum: 0 },
    totalSeats: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["designatedAccessibleSeats", "totalSeats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate a supplied designated-seat share and remaining seats without determining accessibility compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { designatedAccessibleSeats, totalSeats } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(totalSeats) && totalSeats > 0, "totalSeats"),
      totalSeats);
    H.domain(
      designatedAccessibleSeats >= 0 && designatedAccessibleSeats <= totalSeats,
      "designatedAccessibleSeats",
    );
    return {
      fraction: designatedAccessibleSeats / totalSeats,
      remainder: totalSeats - designatedAccessibleSeats,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { designatedAccessibleSeats: 30, totalSeats: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const communityRoomAccessibilitySeatShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "community-development",
          "community development",
          "social sciences",
        ],
        keywords: ["community development", "social sciences"],
      },
      id: "community-development/community-room-accessibility-seat-share",
      title: "Community Room Accessibility Seat Share",
      description:
        "Calculate a supplied designated-seat share and remaining seats without determining accessibility compliance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          designatedAccessibleSeats: { type: "number", minimum: 0 },
          totalSeats: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["designatedAccessibleSeats", "totalSeats"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "designatedAccessibleSeats",
            label: "Designated Accessible Seats",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalSeats",
            label: "Total Seats",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communityRoomAccessibilitySeatShareTool.execute;
export default communityRoomAccessibilitySeatShareTool;
