import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pointCode: string;
  readonly sourceId: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pointCode: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["pointCode", "sourceId", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied acupoint code by source and edition without identifying anatomical locations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pointCode, sourceId, edition } = request;
  const compute = (): Output => {
    H.domain(pointCode.length > 0, "pointCode");
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(edition.length > 0, "edition");
    return { token: JSON.stringify([pointCode, sourceId, edition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pointCode: "P17", sourceId: "Atlas A", edition: "v2" },
  output: { token: '["P17","Atlas A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const acupointSourceCodeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["acupuncture", "health and medicine"],
      keywords: ["acupuncture", "health and medicine"],
    },
    id: "acupuncture/acupoint-source-code-token",
    title: "Acupoint Source Code Token",
    description:
      "Qualify a supplied acupoint code by source and edition without identifying anatomical locations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pointCode: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["pointCode", "sourceId", "edition"],
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
          id: "pointCode",
          label: "Point Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = acupointSourceCodeTokenTool.execute;
export default acupointSourceCodeTokenTool;
