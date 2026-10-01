import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly landmark: readonly number[];
  readonly origin: readonly number[];
  readonly basis: readonly (readonly number[])[];
  readonly suppliedFrameCoordinates: readonly number[];
};
export type Output = {
  readonly frameCoordinates: readonly number[];
  readonly residual: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    landmark: { type: "array", maxItems: 256, items: { type: "number" } },
    origin: { type: "array", maxItems: 256, items: { type: "number" } },
    basis: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
    suppliedFrameCoordinates: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["landmark", "origin", "basis", "suppliedFrameCoordinates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameCoordinates: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    residual: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["frameCoordinates", "residual"],
} as const;
/** Apply a supplied 3D research frame’s projection rows and compare recorded coordinates; no surgical planning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { landmark, origin, basis, suppliedFrameCoordinates } = request;
  const compute = (): Output => {
    H.domain(
      landmark.length === 3 &&
        origin.length === 3 &&
        basis.length === 3 &&
        basis.every((r) => r.length === 3) &&
        suppliedFrameCoordinates.length === 3,
    );
    return (() => {
      const d = landmark.map((x, i) => x - origin[i]),
        frameCoordinates = basis.map((r) =>
          r.reduce((s, x, i) => s + x * d[i], 0),
        );
      return {
        frameCoordinates,
        residual: frameCoordinates.map(
          (x, i) => x - suppliedFrameCoordinates[i],
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    landmark: [3, 4, 5],
    origin: [1, 1, 1],
    basis: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    suppliedFrameCoordinates: [2, 3, 3],
  },
  output: { frameCoordinates: [2, 3, 4], residual: [0, 0, 1] },
} satisfies ToolExample<Input, Output>;
export const jawLandmarkFrameGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "oral-surgery/jaw-landmark-frame-gap",
      title: "Jaw Landmark Frame Gap Tool",
      description:
        "Apply a supplied 3D research frame’s projection rows and compare recorded coordinates; no surgical planning.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          landmark: { type: "array", maxItems: 256, items: { type: "number" } },
          origin: { type: "array", maxItems: 256, items: { type: "number" } },
          basis: {
            type: "array",
            maxItems: 128,
            items: { type: "array", maxItems: 128, items: { type: "number" } },
          },
          suppliedFrameCoordinates: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["landmark", "origin", "basis", "suppliedFrameCoordinates"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frameCoordinates: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          residual: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["frameCoordinates", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "landmark",
            label: "Landmark",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "origin",
            label: "Origin",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "basis",
            label: "Basis",
            required: true,
            valueType: {
              type: "list",
              items: { type: "list", items: { type: "number" } },
            },
          },
          {
            id: "suppliedFrameCoordinates",
            label: "Supplied Frame Coordinates",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "frameCoordinates",
            label: "Frame Coordinates",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "residual",
            label: "Residual",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = jawLandmarkFrameGapTool.execute;
export default jawLandmarkFrameGapTool;
