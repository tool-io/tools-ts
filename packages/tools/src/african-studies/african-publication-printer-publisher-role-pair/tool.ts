import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationId: string;
  readonly suppliedPrinter: string;
  readonly suppliedPublisher: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPrinter: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPublisher: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["publicationId", "suppliedPrinter", "suppliedPublisher"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly supplied printer and publisher roles without inferring publishing history. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationId, suppliedPrinter, suppliedPublisher } = request;
  const compute = (): Output => {
    H.domain(publicationId.length > 0, "publicationId");
    H.domain(suppliedPrinter.length > 0, "suppliedPrinter");
    H.domain(suppliedPublisher.length > 0, "suppliedPublisher");
    return {
      token: JSON.stringify([
        publicationId,
        suppliedPrinter,
        suppliedPublisher,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publicationId: "PUB17",
    suppliedPrinter: "Printer A",
    suppliedPublisher: "Publisher B",
  },
  output: { token: '["PUB17","Printer A","Publisher B"]' },
} satisfies ToolExample<Input, Output>;
export const africanPublicationPrinterPublisherRolePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["african-studies", "african studies", "humanities"],
        keywords: ["african studies", "humanities"],
      },
      id: "african-studies/african-publication-printer-publisher-role-pair",
      title: "African Publication Printer Publisher Role Pair",
      description:
        "Pair explicitly supplied printer and publisher roles without inferring publishing history.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          publicationId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPrinter: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPublisher: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["publicationId", "suppliedPrinter", "suppliedPublisher"],
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
            id: "publicationId",
            label: "Publication Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPrinter",
            label: "Supplied Printer",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPublisher",
            label: "Supplied Publisher",
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
export const run = africanPublicationPrinterPublisherRolePairTool.execute;
export default africanPublicationPrinterPublisherRolePairTool;
