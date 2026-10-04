import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly metadata: string };
export type Output = {
  readonly mediaType: string;
  readonly defaulted: boolean;
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
    mediaType: { type: "string", maxLength: 8192 },
    defaulted: { type: "boolean" },
  },
  required: ["mediaType", "defaulted"],
} as const;
/** Calculate data uri default media type token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { metadata } = request;
  const compute = (): Output => {
    H.domain(!/[\r\n,]/.test(metadata));
    const first = metadata.split(";")[0],
      defaulted = first === "";
    H.domain(
      defaulted ||
        /^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+(?![\s\S])/.test(first),
    );
    return {
      mediaType: defaulted ? "text/plain" : first.toLowerCase(),
      defaulted,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { metadata: ";base64" },
  output: { mediaType: "text/plain", defaulted: true },
} satisfies ToolExample<Input, Output>;
export const dataUriDefaultMediaTypeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/data-uri-default-media-type-token",
    title: "Data URI Default Media Type Token Tool",
    description:
      "Calculate data uri default media type token from explicit caller-supplied inputs.",
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
        mediaType: { type: "string", maxLength: 8192 },
        defaulted: { type: "boolean" },
      },
      required: ["mediaType", "defaulted"],
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
        { id: "mediaType", label: "Media Type", valueType: { type: "string" } },
        { id: "defaulted", label: "Defaulted", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dataUriDefaultMediaTypeTokenTool.execute;
export default dataUriDefaultMediaTypeTokenTool;
