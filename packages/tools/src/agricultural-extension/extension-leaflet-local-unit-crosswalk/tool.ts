import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceValue: number;
  readonly sourcePerBase: number;
  readonly targetPerBase: number;
};
export type Output = { readonly targetValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceValue: { type: "number" },
    sourcePerBase: { type: "number", exclusiveMinimum: 0 },
    targetPerBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceValue", "sourcePerBase", "targetPerBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetValue: { type: "number" } },
  required: ["targetValue"],
} as const;
/** Convert an explicitly supplied local unit basis without a built-in customary-unit table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceValue, sourcePerBase, targetPerBase } = request;
  const compute = (): Output => {
    H.positive(sourcePerBase);
    H.positive(targetPerBase);
    return { targetValue: (sourceValue * targetPerBase) / sourcePerBase };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceValue: 10, sourcePerBase: 2, targetPerBase: 5 },
  output: { targetValue: 25 },
} satisfies ToolExample<Input, Output>;
export const extensionLeafletLocalUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/extension-leaflet-local-unit-crosswalk",
    title: "Extension Leaflet Local Unit Crosswalk Tool",
    description:
      "Convert an explicitly supplied local unit basis without a built-in customary-unit table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceValue: { type: "number" },
        sourcePerBase: { type: "number", exclusiveMinimum: 0 },
        targetPerBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sourceValue", "sourcePerBase", "targetPerBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetValue: { type: "number" } },
      required: ["targetValue"],
    },
    ports: {
      inputs: [
        {
          id: "sourceValue",
          label: "Source Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourcePerBase",
          label: "Source Per Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetPerBase",
          label: "Target Per Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetValue",
          label: "Target Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = extensionLeafletLocalUnitCrosswalkTool.execute;
export default extensionLeafletLocalUnitCrosswalkTool;
