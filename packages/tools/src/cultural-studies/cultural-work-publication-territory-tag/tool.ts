import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly territoryWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    territoryWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["workId", "territoryWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit publication-territory label and source without determining territorial rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, territoryWording, source } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0, "workId");
    H.domain(territoryWording.length > 0, "territoryWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([workId, territoryWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workId: "W17",
    territoryWording: "Territory A",
    source: "Publication record",
  },
  output: { token: '["W17","Territory A","Publication record"]' },
} satisfies ToolExample<Input, Output>;
export const culturalWorkPublicationTerritoryTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cultural-studies", "cultural studies", "humanities"],
        keywords: ["cultural studies", "humanities"],
      },
      id: "cultural-studies/cultural-work-publication-territory-tag",
      title: "Cultural Work Publication Territory Tag",
      description:
        "Preserve an explicit publication-territory label and source without determining territorial rights.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workId: { type: "string", maxLength: 8192, minLength: 1 },
          territoryWording: { type: "string", maxLength: 8192, minLength: 1 },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["workId", "territoryWording", "source"],
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
            id: "workId",
            label: "Work Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "territoryWording",
            label: "Territory Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
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
export const run = culturalWorkPublicationTerritoryTagTool.execute;
export default culturalWorkPublicationTerritoryTagTool;
