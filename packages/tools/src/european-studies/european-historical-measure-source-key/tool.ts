import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measureName: string;
  readonly locality: string;
  readonly sourceId: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measureName: { type: "string", maxLength: 8192 },
    locality: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
  },
  required: ["measureName", "locality", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Namespace a historical measure by locality and source, without assigning a universal conversion factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measureName, locality, sourceId } = request;
  const compute = (): Output => {
    H.domain(
      measureName.length > 0 && locality.length > 0 && sourceId.length > 0,
      "measureName",
    );
    return { key: JSON.stringify([measureName, locality, sourceId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measureName: "ell", locality: "Town A", sourceId: "S12" },
  output: { key: '["ell","Town A","S12"]' },
} satisfies ToolExample<Input, Output>;
export const europeanHistoricalMeasureSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/european-historical-measure-source-key",
    title: "European Historical Measure Source Key Tool",
    description:
      "Namespace a historical measure by locality and source, without assigning a universal conversion factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measureName: { type: "string", maxLength: 8192 },
        locality: { type: "string", maxLength: 8192 },
        sourceId: { type: "string", maxLength: 8192 },
      },
      required: ["measureName", "locality", "sourceId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "measureName",
          label: "Measure Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locality",
          label: "Locality",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = europeanHistoricalMeasureSourceKeyTool.execute;
export default europeanHistoricalMeasureSourceKeyTool;
