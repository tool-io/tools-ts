import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly prefix: string;
  readonly suffix: string;
};
export type Output = { readonly missingUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    prefix: { type: "string", maxLength: 8192 },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["token", "prefix", "suffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missingUnits: { type: "integer" } },
  required: ["missingUnits"],
} as const;
/** Read a caller-defined decimal gap marker without reconstructing missing text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, prefix, suffix } = request;
  const compute = (): Output => {
    H.domain(
      prefix.length > 0 &&
        suffix.length > 0 &&
        token.startsWith(prefix) &&
        token.endsWith(suffix),
    );
    const digits = token.slice(prefix.length, -suffix.length);
    H.domain(/^\d+(?![\s\S])/.test(digits));
    const missingUnits = Number(digits);
    H.integer(missingUnits, 0);
    return { missingUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "[3]", prefix: "[", suffix: "]" },
  output: { missingUnits: 3 },
} satisfies ToolExample<Input, Output>;
export const publicInscriptionGapMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/public-inscription-gap-marker",
    title: "Public Inscription Gap Marker Tool",
    description:
      "Read a caller-defined decimal gap marker without reconstructing missing text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        prefix: { type: "string", maxLength: 8192 },
        suffix: { type: "string", maxLength: 8192 },
      },
      required: ["token", "prefix", "suffix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { missingUnits: { type: "integer" } },
      required: ["missingUnits"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "missingUnits",
          label: "Missing Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicInscriptionGapMarkerTool.execute;
export default publicInscriptionGapMarkerTool;
