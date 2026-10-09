import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceId: string;
  readonly ageText: string;
  readonly boundConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceId: { type: "string", maxLength: 8192, minLength: 1 },
    ageText: { type: "string", maxLength: 8192, minLength: 1 },
    boundConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["surfaceId", "ageText", "boundConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit geomorphic surface age transcription and bound convention without dating or calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceId, ageText, boundConvention } = request;
  const compute = (): Output => {
    H.domain(surfaceId.length > 0, "surfaceId");
    H.domain(ageText.length > 0, "ageText");
    H.domain(boundConvention.length > 0, "boundConvention");
    return { token: JSON.stringify([surfaceId, ageText, boundConvention]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surfaceId: "S17",
    ageText: "12000 years",
    boundConvention: "minimum",
  },
  output: { token: '["S17","12000 years","minimum"]' },
} satisfies ToolExample<Input, Output>;
export const geomorphicSurfaceAgeBoundTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/geomorphic-surface-age-bound-token",
    title: "Geomorphic Surface Age Bound Token Tool",
    description:
      "Preserve an explicit geomorphic surface age transcription and bound convention without dating or calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surfaceId: { type: "string", maxLength: 8192, minLength: 1 },
        ageText: { type: "string", maxLength: 8192, minLength: 1 },
        boundConvention: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["surfaceId", "ageText", "boundConvention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "surfaceId",
          label: "Surface Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ageText",
          label: "Age Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "boundConvention",
          label: "Bound Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = geomorphicSurfaceAgeBoundTokenTool.execute;
export default geomorphicSurfaceAgeBoundTokenTool;
