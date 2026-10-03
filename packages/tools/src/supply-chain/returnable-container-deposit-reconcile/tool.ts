import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly returned: number;
  readonly lost: number;
  readonly depositPerContainer: number;
};
export type Output = {
  readonly outstanding: number;
  readonly refundable: number;
  readonly forfeited: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    lost: { type: "integer", minimum: 0 },
    depositPerContainer: { type: "number", minimum: 0 },
  },
  required: ["issued", "returned", "lost", "depositPerContainer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outstanding: { type: "integer" },
    refundable: { type: "number" },
    forfeited: { type: "number" },
  },
  required: ["outstanding", "refundable", "forfeited"],
} as const;
/** Calculate returnable container deposit reconcile from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, returned, lost, depositPerContainer } = request;
  const compute = (): Output => {
    H.integer(issued, 0);
    H.integer(returned, 0, issued);
    H.integer(lost, 0, issued - returned);
    H.domain(depositPerContainer >= 0);
    return {
      outstanding: issued - returned - lost,
      refundable: returned * depositPerContainer,
      forfeited: lost * depositPerContainer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 100, returned: 70, lost: 5, depositPerContainer: 10 },
  output: { outstanding: 25, refundable: 700, forfeited: 50 },
} satisfies ToolExample<Input, Output>;
export const returnableContainerDepositReconcileTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "supply-chain/returnable-container-deposit-reconcile",
      title: "Returnable Container Deposit Reconcile Tool",
      description:
        "Calculate returnable container deposit reconcile from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issued: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          lost: { type: "integer", minimum: 0 },
          depositPerContainer: { type: "number", minimum: 0 },
        },
        required: ["issued", "returned", "lost", "depositPerContainer"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outstanding: { type: "integer" },
          refundable: { type: "number" },
          forfeited: { type: "number" },
        },
        required: ["outstanding", "refundable", "forfeited"],
      },
      ports: {
        inputs: [
          {
            id: "issued",
            label: "Issued",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lost",
            label: "Lost",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "depositPerContainer",
            label: "Deposit Per Container",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "outstanding",
            label: "Outstanding",
            valueType: { type: "integer" },
          },
          {
            id: "refundable",
            label: "Refundable",
            valueType: { type: "number" },
          },
          {
            id: "forfeited",
            label: "Forfeited",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = returnableContainerDepositReconcileTool.execute;
export default returnableContainerDepositReconcileTool;
