import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contracts: number;
  readonly contractMultiplier: number;
  readonly previousSettlement: number;
  readonly currentSettlement: number;
  readonly longPosition: boolean;
};
export type Output = { readonly variationMargin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contracts: { type: "integer", minimum: 0 },
    contractMultiplier: { type: "number", exclusiveMinimum: 0 },
    previousSettlement: { type: "number" },
    currentSettlement: { type: "number" },
    longPosition: { type: "boolean" },
  },
  required: [
    "contracts",
    "contractMultiplier",
    "previousSettlement",
    "currentSettlement",
    "longPosition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { variationMargin: { type: "number" } },
  required: ["variationMargin"],
} as const;
/** Calculate futures margin variation one settlement from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    contracts,
    contractMultiplier,
    previousSettlement,
    currentSettlement,
    longPosition,
  } = request;
  const compute = (): Output => {
    H.integer(contracts, 0);
    H.positive(contractMultiplier);
    return {
      variationMargin:
        contracts *
        contractMultiplier *
        (currentSettlement - previousSettlement) *
        (longPosition ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contracts: 3,
    contractMultiplier: 100,
    previousSettlement: 50,
    currentSettlement: 52,
    longPosition: true,
  },
  output: { variationMargin: 600 },
} satisfies ToolExample<Input, Output>;
export const futuresMarginVariationOneSettlementTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "financial-economics/futures-margin-variation-one-settlement",
      title: "Futures Margin Variation One Settlement Tool",
      description:
        "Calculate futures margin variation one settlement from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contracts: { type: "integer", minimum: 0 },
          contractMultiplier: { type: "number", exclusiveMinimum: 0 },
          previousSettlement: { type: "number" },
          currentSettlement: { type: "number" },
          longPosition: { type: "boolean" },
        },
        required: [
          "contracts",
          "contractMultiplier",
          "previousSettlement",
          "currentSettlement",
          "longPosition",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { variationMargin: { type: "number" } },
        required: ["variationMargin"],
      },
      ports: {
        inputs: [
          {
            id: "contracts",
            label: "Contracts",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "contractMultiplier",
            label: "Contract Multiplier",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "previousSettlement",
            label: "Previous Settlement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "currentSettlement",
            label: "Current Settlement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "longPosition",
            label: "Long Position",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "variationMargin",
            label: "Variation Margin",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = futuresMarginVariationOneSettlementTool.execute;
export default futuresMarginVariationOneSettlementTool;
