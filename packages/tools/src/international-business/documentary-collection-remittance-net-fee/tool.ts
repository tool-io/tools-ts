import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collected: number;
  readonly collectingFee: number;
  readonly remittingFee: number;
  readonly intermediaryFees: readonly number[];
};
export type Output = {
  readonly totalFees: number;
  readonly netRemitted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collected: { type: "number", minimum: 0 },
    collectingFee: { type: "number", minimum: 0 },
    remittingFee: { type: "number", minimum: 0 },
    intermediaryFees: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["collected", "collectingFee", "remittingFee", "intermediaryFees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFees: { type: "number" },
    netRemitted: { type: "number" },
  },
  required: ["totalFees", "netRemitted"],
} as const;
/** Calculate documentary collection remittance net fee from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collected, collectingFee, remittingFee, intermediaryFees } = request;
  const compute = (): Output => {
    H.domain(
      collected >= 0 &&
        collectingFee >= 0 &&
        remittingFee >= 0 &&
        intermediaryFees.every((x) => x >= 0),
    );
    return {
      totalFees:
        collectingFee +
        remittingFee +
        intermediaryFees.reduce((a, b) => a + b, 0),
      netRemitted:
        collected -
        collectingFee -
        remittingFee -
        intermediaryFees.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collected: 10000,
    collectingFee: 30,
    remittingFee: 20,
    intermediaryFees: [10, 5],
  },
  output: { totalFees: 65, netRemitted: 9935 },
} satisfies ToolExample<Input, Output>;
export const documentaryCollectionRemittanceNetFeeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/documentary-collection-remittance-net-fee",
      title: "Documentary Collection Remittance Net Fee Tool",
      description:
        "Calculate documentary collection remittance net fee from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          collected: { type: "number", minimum: 0 },
          collectingFee: { type: "number", minimum: 0 },
          remittingFee: { type: "number", minimum: 0 },
          intermediaryFees: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: [
          "collected",
          "collectingFee",
          "remittingFee",
          "intermediaryFees",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalFees: { type: "number" },
          netRemitted: { type: "number" },
        },
        required: ["totalFees", "netRemitted"],
      },
      ports: {
        inputs: [
          {
            id: "collected",
            label: "Collected",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "collectingFee",
            label: "Collecting Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "remittingFee",
            label: "Remitting Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intermediaryFees",
            label: "Intermediary Fees",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "totalFees",
            label: "Total Fees",
            valueType: { type: "number" },
          },
          {
            id: "netRemitted",
            label: "Net Remitted",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = documentaryCollectionRemittanceNetFeeTool.execute;
export default documentaryCollectionRemittanceNetFeeTool;
