import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly metadata: string };
export type Output = {
  readonly base64: boolean;
  readonly validPosition: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { metadata: { type: "string", maxLength: 8192 } },
  required: ["metadata"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base64: { type: "boolean" },
    validPosition: { type: "boolean" },
  },
  required: ["base64", "validPosition"],
} as const;
/** Calculate data uri base64 marker position from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { metadata } = input;
  const compute = (): Output => {
    H.domain(!metadata.includes(","));
    const parts = metadata.split(";"),
      indexes = parts.flatMap((x, i) =>
        x.toLowerCase() === "base64" ? [i] : [],
      );
    return {
      base64: indexes.length > 0,
      validPosition:
        indexes.length === 0 ||
        (indexes.length === 1 &&
          indexes[0] === parts.length - 1 &&
          indexes[0] > 0),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { metadata: "text/plain;base64;charset=utf-8" },
  output: { base64: true, validPosition: false },
} satisfies ToolExample<Input, Output>;
export const dataUriBase64MarkerPositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/data-uri-base64-marker-position",
    title: "Data URI Base64 Marker Position Tool",
    description:
      "Calculate data uri base64 marker position from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { metadata: { type: "string", maxLength: 8192 } },
      required: ["metadata"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base64: { type: "boolean" },
        validPosition: { type: "boolean" },
      },
      required: ["base64", "validPosition"],
    },
    ports: {
      inputs: [
        {
          id: "metadata",
          label: "Metadata",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "base64", label: "Base64", valueType: { type: "boolean" } },
        {
          id: "validPosition",
          label: "Valid Position",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dataUriBase64MarkerPositionTool.execute;
export default dataUriBase64MarkerPositionTool;
