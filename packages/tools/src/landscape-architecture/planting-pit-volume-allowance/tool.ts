import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly width: number;
  readonly depth: number;
  readonly excludedVolume: number;
  readonly suppliedReserveFraction: number;
};
export type Output = {
  readonly grossVolume: number;
  readonly availableVolume: number;
  readonly reserveVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    excludedVolume: { type: "number", minimum: 0 },
    suppliedReserveFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "length",
    "width",
    "depth",
    "excludedVolume",
    "suppliedReserveFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossVolume: { type: "number" },
    availableVolume: { type: "number" },
    reserveVolume: { type: "number" },
  },
  required: ["grossVolume", "availableVolume", "reserveVolume"],
} as const;
/** Rectangular supplied volume ledger without horticultural sizing or excavation advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width, depth, excludedVolume, suppliedReserveFraction } =
    request;
  const compute = (): Output => {
    H.probability(suppliedReserveFraction);
    H.domain(
      length >= 0 &&
        width >= 0 &&
        depth >= 0 &&
        excludedVolume >= 0 &&
        excludedVolume <= length * width * depth,
    );
    return {
      grossVolume: length * width * depth,
      availableVolume:
        (length * width * depth - excludedVolume) *
        (1 - suppliedReserveFraction),
      reserveVolume:
        (length * width * depth - excludedVolume) * suppliedReserveFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    length: 2,
    width: 2,
    depth: 1,
    excludedVolume: 1,
    suppliedReserveFraction: 0.25,
  },
  output: { grossVolume: 4, availableVolume: 2.25, reserveVolume: 0.75 },
} satisfies ToolExample<Input, Output>;
export const plantingPitVolumeAllowanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/planting-pit-volume-allowance",
    title: "Planting Pit Volume Allowance Tool",
    description:
      "Rectangular supplied volume ledger without horticultural sizing or excavation advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        excludedVolume: { type: "number", minimum: 0 },
        suppliedReserveFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "length",
        "width",
        "depth",
        "excludedVolume",
        "suppliedReserveFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossVolume: { type: "number" },
        availableVolume: { type: "number" },
        reserveVolume: { type: "number" },
      },
      required: ["grossVolume", "availableVolume", "reserveVolume"],
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
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedVolume",
          label: "Excluded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReserveFraction",
          label: "Supplied Reserve Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossVolume",
          label: "Gross Volume",
          valueType: { type: "number" },
        },
        {
          id: "availableVolume",
          label: "Available Volume",
          valueType: { type: "number" },
        },
        {
          id: "reserveVolume",
          label: "Reserve Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plantingPitVolumeAllowanceTool.execute;
export default plantingPitVolumeAllowanceTool;
