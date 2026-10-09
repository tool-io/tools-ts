import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentVolume: number;
  readonly childVolumes: readonly number[];
  readonly documentedLoss: number;
};
export type Output = {
  readonly unallocatedVolume: number;
  readonly allocatedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentVolume: { type: "number", minimum: 0 },
    childVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
    documentedLoss: { type: "number", minimum: 0 },
  },
  required: ["parentVolume", "childVolumes", "documentedLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unallocatedVolume: { type: "number" },
    allocatedVolume: { type: "number" },
  },
  required: ["unallocatedVolume", "allocatedVolume"],
} as const;
/** Reconcile explicit parent and split-product volumes, preserving signed discrepancies without release or transfusion guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentVolume, childVolumes, documentedLoss } = request;
  const compute = (): Output => {
    H.domain(parentVolume >= 0 && documentedLoss >= 0, "parentVolume");
    H.domain(
      childVolumes.every((v) => v >= 0),
      "childVolumes",
    );
    return (() => {
      const allocatedVolume = childVolumes.reduce((a, b) => a + b, 0);
      return {
        unallocatedVolume: parentVolume - allocatedVolume - documentedLoss,
        allocatedVolume,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentVolume: 300, childVolumes: [100, 150], documentedLoss: 10 },
  output: { unallocatedVolume: 40, allocatedVolume: 250 },
} satisfies ToolExample<Input, Output>;
export const bloodProductUnitSplitBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hematology", "health and medicine"],
      keywords: ["hematology", "health and medicine"],
    },
    id: "hematology/blood-product-unit-split-balance",
    title: "Blood Product Unit Split Balance",
    description:
      "Reconcile explicit parent and split-product volumes, preserving signed discrepancies without release or transfusion guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentVolume: { type: "number", minimum: 0 },
        childVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        documentedLoss: { type: "number", minimum: 0 },
      },
      required: ["parentVolume", "childVolumes", "documentedLoss"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unallocatedVolume: { type: "number" },
        allocatedVolume: { type: "number" },
      },
      required: ["unallocatedVolume", "allocatedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "parentVolume",
          label: "Parent Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "childVolumes",
          label: "Child Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "documentedLoss",
          label: "Documented Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unallocatedVolume",
          label: "Unallocated Volume",
          valueType: { type: "number" },
        },
        {
          id: "allocatedVolume",
          label: "Allocated Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bloodProductUnitSplitBalanceTool.execute;
export default bloodProductUnitSplitBalanceTool;
