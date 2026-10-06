import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly adviceRecordId: string;
  readonly sourceId: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adviceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["adviceRecordId", "sourceId", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit adviser-source reference by edition without generating agronomic advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { adviceRecordId, sourceId, edition } = request;
  const compute = (): Output => {
    H.domain(adviceRecordId.length > 0, "adviceRecordId");
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(edition.length > 0, "edition");
    return { token: JSON.stringify([adviceRecordId, sourceId, edition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { adviceRecordId: "ADV17", sourceId: "SOURCE2", edition: "v2" },
  output: { token: '["ADV17","SOURCE2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const adviserSourceEditionReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/adviser-source-edition-reference",
    title: "Adviser Source Edition Reference",
    description:
      "Qualify an explicit adviser-source reference by edition without generating agronomic advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adviceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["adviceRecordId", "sourceId", "edition"],
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
          id: "adviceRecordId",
          label: "Advice Record Id",
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
export const run = adviserSourceEditionReferenceTool.execute;
export default adviserSourceEditionReferenceTool;
