import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinates: readonly number[];
  readonly basisScales: readonly number[];
};
export type Output = { readonly coordinates: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
    basisScales: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["coordinates", "basisScales"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["coordinates"],
} as const;
/** Calculate vector basis coordinate unit scale from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coordinates, basisScales } = input;
  const compute = (): Output => {
    H.sameLength(coordinates, basisScales);
    H.domain(basisScales.every((x) => x !== 0));
    return { coordinates: coordinates.map((x, i) => x / basisScales[i]) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinates: [2, 6], basisScales: [2, 3] },
  output: { coordinates: [1, 2] },
} satisfies ToolExample<Input, Output>;
export const vectorBasisCoordinateUnitScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-basis-coordinate-unit-scale",
    title: "Vector Basis Coordinate Unit Scale Tool",
    description:
      "Calculate vector basis coordinate unit scale from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        basisScales: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["coordinates", "basisScales"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["coordinates"],
    },
    ports: {
      inputs: [
        {
          id: "coordinates",
          label: "Coordinates",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "basisScales",
          label: "Basis Scales",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "coordinates",
          label: "Coordinates",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorBasisCoordinateUnitScaleTool.execute;
export default vectorBasisCoordinateUnitScaleTool;
