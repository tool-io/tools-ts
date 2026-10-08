import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMass: number;
  readonly incomingMass: number;
  readonly outgoingMass: number;
  readonly additionalLoss: number;
};
export type Output = {
  readonly netChange: number;
  readonly closingMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMass: { type: "number", minimum: 0 },
    incomingMass: { type: "number", minimum: 0 },
    outgoingMass: { type: "number", minimum: 0 },
    additionalLoss: { type: "number", minimum: 0 },
  },
  required: ["openingMass", "incomingMass", "outgoingMass", "additionalLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netChange: { type: "number" },
    closingMass: { type: "number" },
  },
  required: ["netChange", "closingMass"],
} as const;
/** Reconcile explicit ecosystem pool transfers and separate losses on one mass basis without predicting turnover or clipping negative discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingMass, incomingMass, outgoingMass, additionalLoss } = request;
  const compute = (): Output => {
    H.domain(openingMass >= 0, "openingMass");
    H.domain(incomingMass >= 0, "incomingMass");
    H.domain(outgoingMass >= 0, "outgoingMass");
    H.domain(additionalLoss >= 0, "additionalLoss");
    return {
      netChange: incomingMass - outgoingMass - additionalLoss,
      closingMass: openingMass + incomingMass - outgoingMass - additionalLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingMass: 100,
    incomingMass: 20,
    outgoingMass: 15,
    additionalLoss: 5,
  },
  output: { netChange: 0, closingMass: 100 },
} satisfies ToolExample<Input, Output>;
export const ecosystemPoolTransferMassBalanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/ecosystem-pool-transfer-mass-balance-term",
      title: "Ecosystem Pool Transfer Mass Balance Term Tool",
      description:
        "Reconcile explicit ecosystem pool transfers and separate losses on one mass basis without predicting turnover or clipping negative discrepancies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingMass: { type: "number", minimum: 0 },
          incomingMass: { type: "number", minimum: 0 },
          outgoingMass: { type: "number", minimum: 0 },
          additionalLoss: { type: "number", minimum: 0 },
        },
        required: [
          "openingMass",
          "incomingMass",
          "outgoingMass",
          "additionalLoss",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netChange: { type: "number" },
          closingMass: { type: "number" },
        },
        required: ["netChange", "closingMass"],
      },
      ports: {
        inputs: [
          {
            id: "openingMass",
            label: "Opening Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "incomingMass",
            label: "Incoming Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outgoingMass",
            label: "Outgoing Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "additionalLoss",
            label: "Additional Loss",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netChange",
            label: "Net Change",
            valueType: { type: "number" },
          },
          {
            id: "closingMass",
            label: "Closing Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ecosystemPoolTransferMassBalanceTermTool.execute;
export default ecosystemPoolTransferMassBalanceTermTool;
