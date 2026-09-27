import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly available: readonly number[];
  readonly requiredPerParcel: readonly number[];
};
export type Output = {
  readonly completeParcels: number;
  readonly leftovers: readonly number[];
  readonly limitingIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "array", maxItems: 256, items: { type: "integer" } },
    requiredPerParcel: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["available", "requiredPerParcel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeParcels: { type: "integer" },
    leftovers: { type: "array", maxItems: 256, items: { type: "integer" } },
    limitingIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["completeParcels", "leftovers", "limitingIndices"],
} as const;
/** Calculate food parcel mixedpack splitting rounding gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { available, requiredPerParcel } = request;
  const compute = (): Output => {
    H.sameLength(available, requiredPerParcel);
    H.domain(
      available.length > 0 &&
        available.every((x) => x >= 0) &&
        requiredPerParcel.every((x) => x > 0),
    );
    return {
      completeParcels: Math.min(
        ...available.map((x, i) => Math.floor(x / requiredPerParcel[i])),
      ),
      leftovers: available.map(
        (x, i) =>
          x -
          Math.min(
            ...available.map((v, j) => Math.floor(v / requiredPerParcel[j])),
          ) *
            requiredPerParcel[i],
      ),
      limitingIndices: available.flatMap((x, i) =>
        Math.floor(x / requiredPerParcel[i]) ===
        Math.min(
          ...available.map((v, j) => Math.floor(v / requiredPerParcel[j])),
        )
          ? [i]
          : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { available: [10, 12], requiredPerParcel: [2, 3] },
  output: { completeParcels: 4, leftovers: [2, 0], limitingIndices: [1] },
} satisfies ToolExample<Input, Output>;
export const foodParcelMixedpackSplittingRoundingGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/food-parcel-mixedpack-splitting-rounding-gap",
      title: "Food Parcel Mixedpack Splitting Rounding Gap Tool",
      description:
        "Calculate food parcel mixedpack splitting rounding gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          available: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          requiredPerParcel: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["available", "requiredPerParcel"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          completeParcels: { type: "integer" },
          leftovers: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          limitingIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["completeParcels", "leftovers", "limitingIndices"],
      },
      ports: {
        inputs: [
          {
            id: "available",
            label: "Available",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "requiredPerParcel",
            label: "Required Per Parcel",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "completeParcels",
            label: "Complete Parcels",
            valueType: { type: "integer" },
          },
          {
            id: "leftovers",
            label: "Leftovers",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "limitingIndices",
            label: "Limiting Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodParcelMixedpackSplittingRoundingGapTool.execute;
export default foodParcelMixedpackSplittingRoundingGapTool;
