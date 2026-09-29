import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedMass: number;
  readonly returnedMass: number;
  readonly usedMass: number;
  readonly scrapMass: number;
};
export type Output = {
  readonly accountedMass: number;
  readonly residualMass: number;
  readonly reconciledShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedMass: { type: "number" },
    returnedMass: { type: "number" },
    usedMass: { type: "number" },
    scrapMass: { type: "number" },
  },
  required: ["issuedMass", "returnedMass", "usedMass", "scrapMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accountedMass: { type: "number" },
    residualMass: { type: "number" },
    reconciledShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["accountedMass", "residualMass", "reconciledShare", "defined"],
} as const;
/** Reconcile supplied disjoint material dispositions without manufacturing or batch-release instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedMass, returnedMass, usedMass, scrapMass } = request;
  const compute = (): Output => {
    H.domain(
      [issuedMass, returnedMass, usedMass, scrapMass].every((x) => x >= 0),
    );
    return {
      accountedMass: returnedMass + usedMass + scrapMass,
      residualMass: issuedMass - returnedMass - usedMass - scrapMass,
      reconciledShare:
        issuedMass > 0 ? (returnedMass + usedMass + scrapMass) / issuedMass : 0,
      defined: issuedMass > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issuedMass: 100, returnedMass: 10, usedMass: 70, scrapMass: 15 },
  output: {
    accountedMass: 95,
    residualMass: 5,
    reconciledShare: 0.95,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const batchMaterialReconciliationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/batch-material-reconciliation-share",
    title: "Batch Material Reconciliation Share Tool",
    description:
      "Reconcile supplied disjoint material dispositions without manufacturing or batch-release instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issuedMass: { type: "number" },
        returnedMass: { type: "number" },
        usedMass: { type: "number" },
        scrapMass: { type: "number" },
      },
      required: ["issuedMass", "returnedMass", "usedMass", "scrapMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accountedMass: { type: "number" },
        residualMass: { type: "number" },
        reconciledShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["accountedMass", "residualMass", "reconciledShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "issuedMass",
          label: "Issued Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedMass",
          label: "Returned Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usedMass",
          label: "Used Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scrapMass",
          label: "Scrap Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "accountedMass",
          label: "Accounted Mass",
          valueType: { type: "number" },
        },
        {
          id: "residualMass",
          label: "Residual Mass",
          valueType: { type: "number" },
        },
        {
          id: "reconciledShare",
          label: "Reconciled Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = batchMaterialReconciliationShareTool.execute;
export default batchMaterialReconciliationShareTool;
