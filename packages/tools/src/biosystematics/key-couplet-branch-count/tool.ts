import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coupletIds: readonly string[];
  readonly branchLabels: readonly string[];
  readonly requestedCouplet: string;
};
export type Output = {
  readonly distinctBranches: number;
  readonly records: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coupletIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    branchLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedCouplet: { type: "string", maxLength: 8192 },
  },
  required: ["coupletIds", "branchLabels", "requestedCouplet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctBranches: { type: "integer" },
    records: { type: "integer" },
  },
  required: ["distinctBranches", "records"],
} as const;
/** Inspect explicit identification-key branch records without identifying an organism. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coupletIds, branchLabels, requestedCouplet } = request;
  const compute = (): Output => {
    H.sameLength(coupletIds, branchLabels);
    return {
      distinctBranches: new Set(
        branchLabels.filter((x, i) => coupletIds[i] === requestedCouplet),
      ).size,
      records: coupletIds.filter((x) => x === requestedCouplet).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coupletIds: ["1", "1", "2"],
    branchLabels: ["a", "b", "a"],
    requestedCouplet: "1",
  },
  output: { distinctBranches: 2, records: 2 },
} satisfies ToolExample<Input, Output>;
export const keyCoupletBranchCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/key-couplet-branch-count",
    title: "Key Couplet Branch Count Tool",
    description:
      "Inspect explicit identification-key branch records without identifying an organism.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coupletIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        branchLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedCouplet: { type: "string", maxLength: 8192 },
      },
      required: ["coupletIds", "branchLabels", "requestedCouplet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctBranches: { type: "integer" },
        records: { type: "integer" },
      },
      required: ["distinctBranches", "records"],
    },
    ports: {
      inputs: [
        {
          id: "coupletIds",
          label: "Couplet Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "branchLabels",
          label: "Branch Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedCouplet",
          label: "Requested Couplet",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "distinctBranches",
          label: "Distinct Branches",
          valueType: { type: "integer" },
        },
        { id: "records", label: "Records", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = keyCoupletBranchCountTool.execute;
export default keyCoupletBranchCountTool;
