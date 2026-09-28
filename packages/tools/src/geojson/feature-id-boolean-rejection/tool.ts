import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly json: string };
export type Output = {
  readonly validIdentifier: boolean;
  readonly kind: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { json: { type: "string", maxLength: 8192 } },
  required: ["json"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validIdentifier: { type: "boolean" },
    kind: { type: "string", maxLength: 8192 },
  },
  required: ["validIdentifier", "kind"],
} as const;
/** Classify one JSON-encoded GeoJSON feature id; only a string or finite number is accepted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { json } = request;
  const compute = (): Output => {
    const v = H.parseJson(json);
    return {
      validIdentifier:
        typeof v === "string" || (typeof v === "number" && Number.isFinite(v)),
      kind: v === null ? "null" : Array.isArray(v) ? "array" : typeof v,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { json: "true" },
  output: { validIdentifier: false, kind: "boolean" },
} satisfies ToolExample<Input, Output>;
export const featureIdBooleanRejectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-id-boolean-rejection",
    title: "Feature ID Boolean Rejection Tool",
    description:
      "Classify one JSON-encoded GeoJSON feature id; only a string or finite number is accepted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { json: { type: "string", maxLength: 8192 } },
      required: ["json"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validIdentifier: { type: "boolean" },
        kind: { type: "string", maxLength: 8192 },
      },
      required: ["validIdentifier", "kind"],
    },
    ports: {
      inputs: [
        {
          id: "json",
          label: "Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "validIdentifier",
          label: "Valid Identifier",
          valueType: { type: "boolean" },
        },
        { id: "kind", label: "Kind", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = featureIdBooleanRejectionTool.execute;
export default featureIdBooleanRejectionTool;
