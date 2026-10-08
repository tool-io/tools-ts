import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothCode: string;
  readonly surfaceCodes: readonly string[];
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothCode: { type: "string", maxLength: 8192, minLength: 1 },
    surfaceCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["toothCode", "surfaceCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format explicit tooth and uppercase surface-code fields under a local tooth:surfaces notation without interpreting a dental numbering system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothCode, surfaceCodes } = request;
  const compute = (): Output => {
    H.domain(
      toothCode.length > 0 &&
        surfaceCodes.length > 0 &&
        new Set(surfaceCodes).size === surfaceCodes.length,
      "toothCode",
    );
    H.domain(
      surfaceCodes.every((v) => /^[A-Z](?![\s\S])/.test(v)),
      "surfaceCodes",
    );
    return { token: toothCode + ":" + surfaceCodes.join("") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { toothCode: "16", surfaceCodes: ["M", "O"] },
  output: { token: "16:MO" },
} satisfies ToolExample<Input, Output>;
export const toothSurfaceNotationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/tooth-surface-notation-token",
    title: "Tooth Surface Notation Token",
    description:
      "Format explicit tooth and uppercase surface-code fields under a local tooth:surfaces notation without interpreting a dental numbering system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothCode: { type: "string", maxLength: 8192, minLength: 1 },
        surfaceCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["toothCode", "surfaceCodes"],
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
          id: "toothCode",
          label: "Tooth Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "surfaceCodes",
          label: "Surface Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = toothSurfaceNotationTokenTool.execute;
export default toothSurfaceNotationTokenTool;
