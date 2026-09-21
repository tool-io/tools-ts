import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outboundCharge: number;
  readonly backhaulQuantity: number;
  readonly creditPerUnit: number;
  readonly creditCap: number;
};
export type Output = {
  readonly uncappedCredit: number;
  readonly allowedCredit: number;
  readonly netCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outboundCharge: { type: "number", minimum: 0 },
    backhaulQuantity: { type: "number", minimum: 0 },
    creditPerUnit: { type: "number", minimum: 0 },
    creditCap: { type: "number", minimum: 0 },
  },
  required: [
    "outboundCharge",
    "backhaulQuantity",
    "creditPerUnit",
    "creditCap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncappedCredit: { type: "number" },
    allowedCredit: { type: "number" },
    netCharge: { type: "number" },
  },
  required: ["uncappedCredit", "allowedCredit", "netCharge"],
} as const;
/** Calculate agribusiness transport backhaul credit term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outboundCharge, backhaulQuantity, creditPerUnit, creditCap } =
    request;
  const compute = (): Output => {
    H.domain(
      outboundCharge >= 0 &&
        backhaulQuantity >= 0 &&
        creditPerUnit >= 0 &&
        creditCap >= 0,
    );
    return {
      uncappedCredit: backhaulQuantity * creditPerUnit,
      allowedCredit: Math.min(
        outboundCharge,
        creditCap,
        backhaulQuantity * creditPerUnit,
      ),
      netCharge:
        outboundCharge -
        Math.min(outboundCharge, creditCap, backhaulQuantity * creditPerUnit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outboundCharge: 500,
    backhaulQuantity: 10,
    creditPerUnit: 20,
    creditCap: 300,
  },
  output: { uncappedCredit: 200, allowedCredit: 200, netCharge: 300 },
} satisfies ToolExample<Input, Output>;
export const agribusinessTransportBackhaulCreditTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agribusiness/agribusiness-transport-backhaul-credit-term",
      title: "Agribusiness Transport Backhaul Credit Term Tool",
      description:
        "Calculate agribusiness transport backhaul credit term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outboundCharge: { type: "number", minimum: 0 },
          backhaulQuantity: { type: "number", minimum: 0 },
          creditPerUnit: { type: "number", minimum: 0 },
          creditCap: { type: "number", minimum: 0 },
        },
        required: [
          "outboundCharge",
          "backhaulQuantity",
          "creditPerUnit",
          "creditCap",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncappedCredit: { type: "number" },
          allowedCredit: { type: "number" },
          netCharge: { type: "number" },
        },
        required: ["uncappedCredit", "allowedCredit", "netCharge"],
      },
      ports: {
        inputs: [
          {
            id: "outboundCharge",
            label: "Outbound Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "backhaulQuantity",
            label: "Backhaul Quantity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "creditPerUnit",
            label: "Credit Per Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "creditCap",
            label: "Credit Cap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uncappedCredit",
            label: "Uncapped Credit",
            valueType: { type: "number" },
          },
          {
            id: "allowedCredit",
            label: "Allowed Credit",
            valueType: { type: "number" },
          },
          {
            id: "netCharge",
            label: "Net Charge",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agribusinessTransportBackhaulCreditTermTool.execute;
export default agribusinessTransportBackhaulCreditTermTool;
