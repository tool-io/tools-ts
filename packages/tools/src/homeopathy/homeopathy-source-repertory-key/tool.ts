import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repertoryId: string;
  readonly entryCode: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repertoryId: { type: "string", maxLength: 8192, minLength: 1 },
    entryCode: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["repertoryId", "entryCode", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied repertory entry code by source edition without retrieving or endorsing its claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { repertoryId, entryCode, edition } = request;
  const compute = (): Output => {
    H.domain(repertoryId.length > 0, "repertoryId");
    H.domain(entryCode.length > 0, "entryCode");
    H.domain(edition.length > 0, "edition");
    return { token: JSON.stringify([repertoryId, entryCode, edition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { repertoryId: "REP17", entryCode: "E2", edition: "v2" },
  output: { token: '["REP17","E2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const homeopathySourceRepertoryKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["homeopathy", "health and medicine"],
      keywords: ["homeopathy", "health and medicine"],
    },
    id: "homeopathy/homeopathy-source-repertory-key",
    title: "Homeopathy Source Repertory Key",
    description:
      "Qualify a supplied repertory entry code by source edition without retrieving or endorsing its claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repertoryId: { type: "string", maxLength: 8192, minLength: 1 },
        entryCode: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["repertoryId", "entryCode", "edition"],
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
          id: "repertoryId",
          label: "Repertory Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "entryCode",
          label: "Entry Code",
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
export const run = homeopathySourceRepertoryKeyTool.execute;
export default homeopathySourceRepertoryKeyTool;
