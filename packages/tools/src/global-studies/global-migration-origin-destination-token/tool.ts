import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originCode: string;
  readonly destinationCode: string;
  readonly classificationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originCode: { type: "string", maxLength: 8192, minLength: 1 },
    destinationCode: { type: "string", maxLength: 8192, minLength: 1 },
    classificationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["originCode", "destinationCode", "classificationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Construct a directed origin/destination record key under an explicit source classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originCode, destinationCode, classificationSource } = request;
  const compute = (): Output => {
    H.domain(originCode.length > 0, "originCode");
    H.domain(destinationCode.length > 0, "destinationCode");
    H.domain(classificationSource.length > 0, "classificationSource");
    return {
      token: JSON.stringify([
        originCode,
        destinationCode,
        classificationSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originCode: "AA",
    destinationCode: "BB",
    classificationSource: "Classification A",
  },
  output: { token: '["AA","BB","Classification A"]' },
} satisfies ToolExample<Input, Output>;
export const globalMigrationOriginDestinationTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["global-studies", "global studies", "social sciences"],
        keywords: ["global studies", "social sciences"],
      },
      id: "global-studies/global-migration-origin-destination-token",
      title: "Global Migration Origin Destination Token",
      description:
        "Construct a directed origin/destination record key under an explicit source classification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originCode: { type: "string", maxLength: 8192, minLength: 1 },
          destinationCode: { type: "string", maxLength: 8192, minLength: 1 },
          classificationSource: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["originCode", "destinationCode", "classificationSource"],
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
            id: "originCode",
            label: "Origin Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "destinationCode",
            label: "Destination Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "classificationSource",
            label: "Classification Source",
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
export const run = globalMigrationOriginDestinationTokenTool.execute;
export default globalMigrationOriginDestinationTokenTool;
