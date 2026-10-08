import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly editionId: string;
  readonly sourceWorkId: string;
  readonly suppliedAttribution: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceWorkId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAttribution: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["editionId", "sourceWorkId", "suppliedAttribution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit fan-edition attribution record without granting rights or verifying attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { editionId, sourceWorkId, suppliedAttribution } = request;
  const compute = (): Output => {
    H.domain(editionId.length > 0, "editionId");
    H.domain(sourceWorkId.length > 0, "sourceWorkId");
    H.domain(suppliedAttribution.length > 0, "suppliedAttribution");
    return {
      token: JSON.stringify([editionId, sourceWorkId, suppliedAttribution]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    editionId: "ED17",
    sourceWorkId: "W2",
    suppliedAttribution: "Source credit A",
  },
  output: { token: '["ED17","W2","Source credit A"]' },
} satisfies ToolExample<Input, Output>;
export const fanEditionSourceWorkAttributionTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cultural-studies", "cultural studies", "humanities"],
        keywords: ["cultural studies", "humanities"],
      },
      id: "cultural-studies/fan-edition-source-work-attribution-token",
      title: "Fan Edition Source Work Attribution Token",
      description:
        "Qualify an explicit fan-edition attribution record without granting rights or verifying attribution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          editionId: { type: "string", maxLength: 8192, minLength: 1 },
          sourceWorkId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedAttribution: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["editionId", "sourceWorkId", "suppliedAttribution"],
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
            id: "editionId",
            label: "Edition Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceWorkId",
            label: "Source Work Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedAttribution",
            label: "Supplied Attribution",
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
export const run = fanEditionSourceWorkAttributionTokenTool.execute;
export default fanEditionSourceWorkAttributionTokenTool;
