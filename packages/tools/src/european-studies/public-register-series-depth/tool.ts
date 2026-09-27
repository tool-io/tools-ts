import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionParts: readonly string[];
  readonly seriesParts: readonly string[];
  readonly includeCollectionRoot: boolean;
};
export type Output = {
  readonly collectionDepth: number;
  readonly seriesDepth: number;
  readonly combinedDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionParts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    seriesParts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    includeCollectionRoot: { type: "boolean" },
  },
  required: ["collectionParts", "seriesParts", "includeCollectionRoot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionDepth: { type: "integer" },
    seriesDepth: { type: "integer" },
    combinedDepth: { type: "integer" },
  },
  required: ["collectionDepth", "seriesDepth", "combinedDepth"],
} as const;
/** Calculate public register series depth from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionParts, seriesParts, includeCollectionRoot } = request;
  const compute = (): Output => {
    return {
      collectionDepth: collectionParts.length,
      seriesDepth: seriesParts.length,
      combinedDepth:
        collectionParts.length +
        seriesParts.length +
        (includeCollectionRoot ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectionParts: ["A"],
    seriesParts: ["B", "C"],
    includeCollectionRoot: true,
  },
  output: { collectionDepth: 1, seriesDepth: 2, combinedDepth: 4 },
} satisfies ToolExample<Input, Output>;
export const publicRegisterSeriesDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/public-register-series-depth",
    title: "Public Register Series Depth Tool",
    description:
      "Calculate public register series depth from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionParts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        seriesParts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        includeCollectionRoot: { type: "boolean" },
      },
      required: ["collectionParts", "seriesParts", "includeCollectionRoot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionDepth: { type: "integer" },
        seriesDepth: { type: "integer" },
        combinedDepth: { type: "integer" },
      },
      required: ["collectionDepth", "seriesDepth", "combinedDepth"],
    },
    ports: {
      inputs: [
        {
          id: "collectionParts",
          label: "Collection Parts",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "seriesParts",
          label: "Series Parts",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "includeCollectionRoot",
          label: "Include Collection Root",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "collectionDepth",
          label: "Collection Depth",
          valueType: { type: "integer" },
        },
        {
          id: "seriesDepth",
          label: "Series Depth",
          valueType: { type: "integer" },
        },
        {
          id: "combinedDepth",
          label: "Combined Depth",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicRegisterSeriesDepthTool.execute;
export default publicRegisterSeriesDepthTool;
