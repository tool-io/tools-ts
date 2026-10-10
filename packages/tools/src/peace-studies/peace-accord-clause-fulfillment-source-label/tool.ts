import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly accordId: string;
  readonly clauseReference: string;
  readonly suppliedFulfillmentLabel: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accordId: { type: "string", maxLength: 8192, minLength: 1 },
    clauseReference: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedFulfillmentLabel: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "accordId",
    "clauseReference",
    "suppliedFulfillmentLabel",
    "source",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly sourced peace-accord clause fulfillment label without deciding compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accordId, clauseReference, suppliedFulfillmentLabel, source } =
    request;
  const compute = (): Output => {
    H.domain(accordId.length > 0, "accordId");
    H.domain(clauseReference.length > 0, "clauseReference");
    H.domain(suppliedFulfillmentLabel.length > 0, "suppliedFulfillmentLabel");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([
        accordId,
        clauseReference,
        suppliedFulfillmentLabel,
        source,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    accordId: "ACC17",
    clauseReference: "3.2",
    suppliedFulfillmentLabel: "status A",
    source: "Source A",
  },
  output: { token: '["ACC17","3.2","status A","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const peaceAccordClauseFulfillmentSourceLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["peace-studies", "peace studies", "social sciences"],
        keywords: ["peace studies", "social sciences"],
      },
      id: "peace-studies/peace-accord-clause-fulfillment-source-label",
      title: "Peace Accord Clause Fulfillment Source Label",
      description:
        "Preserve an explicitly sourced peace-accord clause fulfillment label without deciding compliance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          accordId: { type: "string", maxLength: 8192, minLength: 1 },
          clauseReference: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedFulfillmentLabel: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: [
          "accordId",
          "clauseReference",
          "suppliedFulfillmentLabel",
          "source",
        ],
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
            id: "accordId",
            label: "Accord Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "clauseReference",
            label: "Clause Reference",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedFulfillmentLabel",
            label: "Supplied Fulfillment Label",
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
export const run = peaceAccordClauseFulfillmentSourceLabelTool.execute;
export default peaceAccordClauseFulfillmentSourceLabelTool;
