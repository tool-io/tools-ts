import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targets: readonly number[];
  readonly filled: readonly number[];
  readonly stratumLabels: readonly string[];
};
export type Output = {
  readonly unfilledSlots: readonly number[];
  readonly overfilledStrata: readonly string[];
  readonly totalUnfilled: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targets: { type: "array", maxItems: 256, items: { type: "integer" } },
    filled: { type: "array", maxItems: 256, items: { type: "integer" } },
    stratumLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["targets", "filled", "stratumLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unfilledSlots: { type: "array", maxItems: 256, items: { type: "integer" } },
    overfilledStrata: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    totalUnfilled: { type: "integer" },
  },
  required: ["unfilledSlots", "overfilledStrata", "totalUnfilled"],
} as const;
/** Count supplied stratum slot deficits and overfills without generating or revealing allocations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targets, filled, stratumLabels } = request;
  const compute = (): Output => {
    H.sameLength(targets, filled);
    H.sameLength(targets, stratumLabels);
    H.domain(
      targets.every((x) => x >= 0) &&
        filled.every((x) => x >= 0) &&
        new Set(stratumLabels).size === stratumLabels.length,
    );
    const unfilledSlots = targets.map((x, i) => Math.max(0, x - filled[i]));
    return {
      unfilledSlots,
      overfilledStrata: stratumLabels.filter((_, i) => filled[i] > targets[i]),
      totalUnfilled: unfilledSlots.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targets: [10, 8], filled: [7, 9], stratumLabels: ["S1", "S2"] },
  output: { unfilledSlots: [3, 0], overfilledStrata: ["S2"], totalUnfilled: 3 },
} satisfies ToolExample<Input, Output>;
export const allocationStratumUnfilledSlotCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/allocation-stratum-unfilled-slot-count",
    title: "Allocation Stratum Unfilled Slot Count Tool",
    description:
      "Count supplied stratum slot deficits and overfills without generating or revealing allocations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targets: { type: "array", maxItems: 256, items: { type: "integer" } },
        filled: { type: "array", maxItems: 256, items: { type: "integer" } },
        stratumLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["targets", "filled", "stratumLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unfilledSlots: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        overfilledStrata: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        totalUnfilled: { type: "integer" },
      },
      required: ["unfilledSlots", "overfilledStrata", "totalUnfilled"],
    },
    ports: {
      inputs: [
        {
          id: "targets",
          label: "Targets",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "filled",
          label: "Filled",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "stratumLabels",
          label: "Stratum Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "unfilledSlots",
          label: "Unfilled Slots",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "overfilledStrata",
          label: "Overfilled Strata",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "totalUnfilled",
          label: "Total Unfilled",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = allocationStratumUnfilledSlotCountTool.execute;
export default allocationStratumUnfilledSlotCountTool;
