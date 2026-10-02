import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly width: number;
  readonly totalDepth: number;
  readonly waterDepth: number;
  readonly reserveDepth: number;
};
export type Output = {
  readonly remainingVolume: number;
  readonly reserveVolume: number;
  readonly excessReserveVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    totalDepth: { type: "number", minimum: 0 },
    waterDepth: { type: "number", minimum: 0 },
    reserveDepth: { type: "number", minimum: 0 },
  },
  required: ["length", "width", "totalDepth", "waterDepth", "reserveDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingVolume: { type: "number" },
    reserveVolume: { type: "number" },
    excessReserveVolume: { type: "number" },
  },
  required: ["remainingVolume", "reserveVolume", "excessReserveVolume"],
} as const;
/** Ideal rectangular supplied storage geometry without earthworks design or flood-safety assurance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width, totalDepth, waterDepth, reserveDepth } = request;
  const compute = (): Output => {
    H.domain(
      length >= 0 &&
        width >= 0 &&
        totalDepth >= 0 &&
        waterDepth >= 0 &&
        waterDepth <= totalDepth &&
        reserveDepth >= 0,
    );
    return {
      remainingVolume: length * width * (totalDepth - waterDepth),
      reserveVolume: length * width * reserveDepth,
      excessReserveVolume:
        length * width * (totalDepth - waterDepth - reserveDepth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    length: 10,
    width: 2,
    totalDepth: 1,
    waterDepth: 0.5,
    reserveDepth: 0.2,
  },
  output: { remainingVolume: 10, reserveVolume: 4, excessReserveVolume: 6 },
} satisfies ToolExample<Input, Output>;
export const swaleFreeboardReserveVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/swale-freeboard-reserve-volume",
    title: "Swale Freeboard Reserve Volume Tool",
    description:
      "Ideal rectangular supplied storage geometry without earthworks design or flood-safety assurance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        totalDepth: { type: "number", minimum: 0 },
        waterDepth: { type: "number", minimum: 0 },
        reserveDepth: { type: "number", minimum: 0 },
      },
      required: ["length", "width", "totalDepth", "waterDepth", "reserveDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingVolume: { type: "number" },
        reserveVolume: { type: "number" },
        excessReserveVolume: { type: "number" },
      },
      required: ["remainingVolume", "reserveVolume", "excessReserveVolume"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalDepth",
          label: "Total Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDepth",
          label: "Water Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserveDepth",
          label: "Reserve Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingVolume",
          label: "Remaining Volume",
          valueType: { type: "number" },
        },
        {
          id: "reserveVolume",
          label: "Reserve Volume",
          valueType: { type: "number" },
        },
        {
          id: "excessReserveVolume",
          label: "Excess Reserve Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = swaleFreeboardReserveVolumeTool.execute;
export default swaleFreeboardReserveVolumeTool;
