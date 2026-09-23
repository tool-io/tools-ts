import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerIndices: readonly number[];
  readonly recordedHeights: readonly number[];
  readonly sourceHeights: readonly number[];
  readonly unitFactor: number;
};
export type Output = {
  readonly heightResiduals: readonly number[];
  readonly mismatchedLayers: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    recordedHeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    sourceHeights: { type: "array", maxItems: 256, items: { type: "number" } },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["layerIndices", "recordedHeights", "sourceHeights", "unitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightResiduals: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    mismatchedLayers: { type: "integer" },
  },
  required: ["heightResiduals", "mismatchedLayers"],
} as const;
/** Calculate layer coordinate source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerIndices, recordedHeights, sourceHeights, unitFactor } = request;
  const compute = (): Output => {
    H.sameLength(layerIndices, recordedHeights);
    H.sameLength(layerIndices, sourceHeights);
    H.domain(new Set(layerIndices).size === layerIndices.length);
    H.positive(unitFactor);
    return (() => {
      const heightResiduals = recordedHeights.map(
        (x, i) => x - sourceHeights[i] * unitFactor,
      );
      return {
        heightResiduals,
        mismatchedLayers: heightResiduals.filter((x) => x !== 0).length,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    layerIndices: [0, 1],
    recordedHeights: [0, 3],
    sourceHeights: [0, 1],
    unitFactor: 2,
  },
  output: { heightResiduals: [0, 1], mismatchedLayers: 1 },
} satisfies ToolExample<Input, Output>;
export const layerCoordinateSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/layer-coordinate-source-gap",
    title: "Layer Coordinate Source Gap Tool",
    description:
      "Calculate layer coordinate source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        recordedHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sourceHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "layerIndices",
        "recordedHeights",
        "sourceHeights",
        "unitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightResiduals: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        mismatchedLayers: { type: "integer" },
      },
      required: ["heightResiduals", "mismatchedLayers"],
    },
    ports: {
      inputs: [
        {
          id: "layerIndices",
          label: "Layer Indices",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "recordedHeights",
          label: "Recorded Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceHeights",
          label: "Source Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightResiduals",
          label: "Height Residuals",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "mismatchedLayers",
          label: "Mismatched Layers",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = layerCoordinateSourceGapTool.execute;
export default layerCoordinateSourceGapTool;
