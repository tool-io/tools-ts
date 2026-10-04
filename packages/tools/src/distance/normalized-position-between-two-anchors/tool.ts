import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly firstAnchor: number;
  readonly secondAnchor: number;
};
export type Output = { readonly position: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    firstAnchor: { type: "number" },
    secondAnchor: { type: "number" },
  },
  required: ["coordinate", "firstAnchor", "secondAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { position: { type: "number" } },
  required: ["position"],
} as const;
/** Map an axis coordinate to a directed affine position between two distinct anchors; values outside the segment remain unbounded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, firstAnchor, secondAnchor } = request;
  const compute = (): Output => {
    H.domain(firstAnchor !== secondAnchor, "secondAnchor");
    return {
      position: (coordinate - firstAnchor) / (secondAnchor - firstAnchor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 15, firstAnchor: 10, secondAnchor: 30 },
  output: { position: 0.25 },
} satisfies ToolExample<Input, Output>;
export const normalizedPositionBetweenTwoAnchorsTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "distance/normalized-position-between-two-anchors",
      title: "Normalized Position Between Two Anchors Tool",
      description:
        "Map an axis coordinate to a directed affine position between two distinct anchors; values outside the segment remain unbounded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinate: { type: "number" },
          firstAnchor: { type: "number" },
          secondAnchor: { type: "number" },
        },
        required: ["coordinate", "firstAnchor", "secondAnchor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { position: { type: "number" } },
        required: ["position"],
      },
      ports: {
        inputs: [
          {
            id: "coordinate",
            label: "Coordinate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstAnchor",
            label: "First Anchor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondAnchor",
            label: "Second Anchor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "position", label: "Position", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = normalizedPositionBetweenTwoAnchorsTool.execute;
export default normalizedPositionBetweenTwoAnchorsTool;
