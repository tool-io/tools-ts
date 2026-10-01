import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly side: string;
  readonly mirrored: boolean;
  readonly coordinates: readonly number[];
  readonly midline: number;
};
export type Output = {
  readonly side: string;
  readonly coordinates: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "midline"],
    },
    mirrored: { type: "boolean" },
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
    midline: { type: "number" },
  },
  required: ["side", "mirrored", "coordinates", "midline"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: { type: "string", maxLength: 8192 },
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["side", "coordinates"],
} as const;
/** Reflect explicit scan coordinates and a supplied laterality tag together. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { side, mirrored, coordinates, midline } = request;
  const compute = (): Output => {
    H.domain(["left", "right", "midline"].includes(side), "side");
    return {
      side: mirrored
        ? side === "left"
          ? "right"
          : side === "right"
            ? "left"
            : "midline"
        : side,
      coordinates: coordinates.map((x) => (mirrored ? 2 * midline - x : x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { side: "left", mirrored: true, coordinates: [1, 3], midline: 2 },
  output: { side: "right", coordinates: [3, 1] },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryScanMirrorLateralityPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "oral-surgery/oral-surgery-scan-mirror-laterality-pair",
      title: "Oral Surgery Scan Mirror Laterality Pair Tool",
      description:
        "Reflect explicit scan coordinates and a supplied laterality tag together.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          side: {
            type: "string",
            maxLength: 8192,
            enum: ["left", "right", "midline"],
          },
          mirrored: { type: "boolean" },
          coordinates: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          midline: { type: "number" },
        },
        required: ["side", "mirrored", "coordinates", "midline"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          side: { type: "string", maxLength: 8192 },
          coordinates: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["side", "coordinates"],
      },
      ports: {
        inputs: [
          {
            id: "side",
            label: "Side",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "mirrored",
            label: "Mirrored",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "coordinates",
            label: "Coordinates",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "midline",
            label: "Midline",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "side", label: "Side", valueType: { type: "string" } },
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
export const run = oralSurgeryScanMirrorLateralityPairTool.execute;
export default oralSurgeryScanMirrorLateralityPairTool;
