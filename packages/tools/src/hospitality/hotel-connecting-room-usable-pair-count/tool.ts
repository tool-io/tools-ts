import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAvailable: readonly boolean[];
  readonly secondAvailable: readonly boolean[];
};
export type Output = {
  readonly usablePairs: number;
  readonly indexes: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAvailable: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    secondAvailable: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["firstAvailable", "secondAvailable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usablePairs: { type: "integer" },
    indexes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["usablePairs", "indexes"],
} as const;
/** Count caller-supplied disjoint connecting pairs for which both rooms are available. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAvailable, secondAvailable } = request;
  const compute = (): Output => {
    H.sameLength(firstAvailable, secondAvailable);
    const indexes = firstAvailable.flatMap((x, i) =>
      x && secondAvailable[i] ? [i] : [],
    );
    return { usablePairs: indexes.length, indexes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAvailable: [true, true, false],
    secondAvailable: [true, false, true],
  },
  output: { usablePairs: 1, indexes: [0] },
} satisfies ToolExample<Input, Output>;
export const hotelConnectingRoomUsablePairCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/hotel-connecting-room-usable-pair-count",
    title: "Hotel Connecting Room Usable Pair Count Tool",
    description:
      "Count caller-supplied disjoint connecting pairs for which both rooms are available.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAvailable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        secondAvailable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["firstAvailable", "secondAvailable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usablePairs: { type: "integer" },
        indexes: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["usablePairs", "indexes"],
    },
    ports: {
      inputs: [
        {
          id: "firstAvailable",
          label: "First Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "secondAvailable",
          label: "Second Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "usablePairs",
          label: "Usable Pairs",
          valueType: { type: "integer" },
        },
        {
          id: "indexes",
          label: "Indexes",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = hotelConnectingRoomUsablePairCountTool.execute;
export default hotelConnectingRoomUsablePairCountTool;
