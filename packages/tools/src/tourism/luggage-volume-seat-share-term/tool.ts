import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumes: readonly number[];
  readonly sharedVolume: number;
  readonly seatVolume: number;
};
export type Output = {
  readonly netVolume: number;
  readonly seatEquivalents: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumes: { type: "array", maxItems: 256, items: { type: "number" } },
    sharedVolume: { type: "number", minimum: 0 },
    seatVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volumes", "sharedVolume", "seatVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netVolume: { type: "number" },
    seatEquivalents: { type: "number" },
  },
  required: ["netVolume", "seatEquivalents"],
} as const;
/** Volume-equivalent allocation only, without assuming a geometric packing or transport policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumes, sharedVolume, seatVolume } = request;
  const compute = (): Output => {
    H.positive(seatVolume);
    H.domain(
      volumes.every((x) => x >= 0) &&
        sharedVolume >= 0 &&
        sharedVolume <= volumes.reduce((a, b) => a + b, 0),
    );
    return {
      netVolume: volumes.reduce((a, b) => a + b, 0) - sharedVolume,
      seatEquivalents:
        (volumes.reduce((a, b) => a + b, 0) - sharedVolume) / seatVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumes: [20, 30], sharedVolume: 5, seatVolume: 60 },
  output: { netVolume: 45, seatEquivalents: 0.75 },
} satisfies ToolExample<Input, Output>;
export const luggageVolumeSeatShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/luggage-volume-seat-share-term",
    title: "Luggage Volume Seat Share Term Tool",
    description:
      "Volume-equivalent allocation only, without assuming a geometric packing or transport policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumes: { type: "array", maxItems: 256, items: { type: "number" } },
        sharedVolume: { type: "number", minimum: 0 },
        seatVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volumes", "sharedVolume", "seatVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netVolume: { type: "number" },
        seatEquivalents: { type: "number" },
      },
      required: ["netVolume", "seatEquivalents"],
    },
    ports: {
      inputs: [
        {
          id: "volumes",
          label: "Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sharedVolume",
          label: "Shared Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seatVolume",
          label: "Seat Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netVolume", label: "Net Volume", valueType: { type: "number" } },
        {
          id: "seatEquivalents",
          label: "Seat Equivalents",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = luggageVolumeSeatShareTermTool.execute;
export default luggageVolumeSeatShareTermTool;
