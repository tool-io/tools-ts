import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archiveId: string;
  readonly firstNumberText: string;
  readonly secondNumberText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archiveId: { type: "string", maxLength: 8192, minLength: 1 },
    firstNumberText: { type: "string", maxLength: 8192, minLength: 1 },
    secondNumberText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["archiveId", "firstNumberText", "secondNumberText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly supplied archive numbering references without asserting identity beyond the recorded relation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archiveId, firstNumberText, secondNumberText } = request;
  const compute = (): Output => {
    H.domain(archiveId.length > 0, "archiveId");
    H.domain(firstNumberText.length > 0, "firstNumberText");
    H.domain(secondNumberText.length > 0, "secondNumberText");
    return {
      token: JSON.stringify([archiveId, firstNumberText, secondNumberText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    archiveId: "AR17",
    firstNumberText: "OLD-42",
    secondNumberText: "NEW-108",
  },
  output: { token: '["AR17","OLD-42","NEW-108"]' },
} satisfies ToolExample<Input, Output>;
export const asianArchiveDualNumberCrossReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["asian-studies", "asian studies", "humanities"],
        keywords: ["asian studies", "humanities"],
      },
      id: "asian-studies/asian-archive-dual-number-cross-reference",
      title: "Asian Archive Dual Number Cross Reference",
      description:
        "Pair explicitly supplied archive numbering references without asserting identity beyond the recorded relation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          archiveId: { type: "string", maxLength: 8192, minLength: 1 },
          firstNumberText: { type: "string", maxLength: 8192, minLength: 1 },
          secondNumberText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["archiveId", "firstNumberText", "secondNumberText"],
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
            id: "archiveId",
            label: "Archive Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstNumberText",
            label: "First Number Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondNumberText",
            label: "Second Number Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = asianArchiveDualNumberCrossReferenceTool.execute;
export default asianArchiveDualNumberCrossReferenceTool;
