import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bbox: readonly number[] };
export type Output = {
  readonly minimumAltitude: number;
  readonly maximumAltitude: number;
  readonly valid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bbox: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["bbox"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumAltitude: { type: "number" },
    maximumAltitude: { type: "number" },
    valid: { type: "boolean" },
  },
  required: ["minimumAltitude", "maximumAltitude", "valid"],
} as const;
/** Calculate feature bbox altitude extent pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { bbox } = input;
  const compute = (): Output => {
    H.domain(bbox.length === 6);
    return {
      minimumAltitude: bbox[2],
      maximumAltitude: bbox[5],
      valid: bbox[2] <= bbox[5],
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bbox: [0, 0, 10, 1, 1, 20] },
  output: { minimumAltitude: 10, maximumAltitude: 20, valid: true },
} satisfies ToolExample<Input, Output>;
export const featureBboxAltitudeExtentPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-bbox-altitude-extent-pair",
    title: "Feature Bbox Altitude Extent Pair Tool",
    description:
      "Calculate feature bbox altitude extent pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bbox: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["bbox"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumAltitude: { type: "number" },
        maximumAltitude: { type: "number" },
        valid: { type: "boolean" },
      },
      required: ["minimumAltitude", "maximumAltitude", "valid"],
    },
    ports: {
      inputs: [
        {
          id: "bbox",
          label: "Bbox",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "minimumAltitude",
          label: "Minimum Altitude",
          valueType: { type: "number" },
        },
        {
          id: "maximumAltitude",
          label: "Maximum Altitude",
          valueType: { type: "number" },
        },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featureBboxAltitudeExtentPairTool.execute;
export default featureBboxAltitudeExtentPairTool;
