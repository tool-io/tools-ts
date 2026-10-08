import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly landmarkCoordinates: readonly number[];
  readonly referenceCoordinates: readonly number[];
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    landmarkCoordinates: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    referenceCoordinates: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["landmarkCoordinates", "referenceCoordinates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Measure Euclidean distance between supplied aligned morphogenesis landmark and reference coordinates in consistent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { landmarkCoordinates, referenceCoordinates } = request;
  const compute = (): Output => {
    H.domain(landmarkCoordinates.length > 0, "landmarkCoordinates");
    H.domain(
      landmarkCoordinates.length === referenceCoordinates.length,
      "referenceCoordinates",
    );
    return {
      distance: Math.hypot(
        ...landmarkCoordinates.map(
          (value, index) => value - referenceCoordinates[index],
        ),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { landmarkCoordinates: [0, 0], referenceCoordinates: [3, 4] },
  output: { distance: 5 },
} satisfies ToolExample<Input, Output>;
export const morphogenesisReferenceLandmarkDistanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/morphogenesis-reference-landmark-distance",
      title: "Morphogenesis Reference Landmark Distance Tool",
      description:
        "Measure Euclidean distance between supplied aligned morphogenesis landmark and reference coordinates in consistent units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          landmarkCoordinates: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          referenceCoordinates: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["landmarkCoordinates", "referenceCoordinates"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { distance: { type: "number" } },
        required: ["distance"],
      },
      ports: {
        inputs: [
          {
            id: "landmarkCoordinates",
            label: "Landmark Coordinates",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "referenceCoordinates",
            label: "Reference Coordinates",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          { id: "distance", label: "Distance", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = morphogenesisReferenceLandmarkDistanceTool.execute;
export default morphogenesisReferenceLandmarkDistanceTool;
