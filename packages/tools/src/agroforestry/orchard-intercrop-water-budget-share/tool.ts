import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly available: number;
  readonly treeAllocation: number;
  readonly intercropAllocation: number;
  readonly overlapCredit: number;
};
export type Output = {
  readonly netAllocated: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "number", minimum: 0 },
    treeAllocation: { type: "number", minimum: 0 },
    intercropAllocation: { type: "number", minimum: 0 },
    overlapCredit: { type: "number", minimum: 0 },
  },
  required: [
    "available",
    "treeAllocation",
    "intercropAllocation",
    "overlapCredit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netAllocated: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["netAllocated", "remaining"],
} as const;
/** Calculate orchard intercrop water budget share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { available, treeAllocation, intercropAllocation, overlapCredit } =
    request;
  const compute = (): Output => {
    H.domain(
      available >= 0 &&
        treeAllocation >= 0 &&
        intercropAllocation >= 0 &&
        overlapCredit >= 0 &&
        overlapCredit <= Math.min(treeAllocation, intercropAllocation),
    );
    return {
      netAllocated: treeAllocation + intercropAllocation - overlapCredit,
      remaining:
        available - treeAllocation - intercropAllocation + overlapCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    available: 100,
    treeAllocation: 60,
    intercropAllocation: 50,
    overlapCredit: 20,
  },
  output: { netAllocated: 90, remaining: 10 },
} satisfies ToolExample<Input, Output>;
export const orchardIntercropWaterBudgetShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/orchard-intercrop-water-budget-share",
    title: "Orchard Intercrop Water Budget Share Tool",
    description:
      "Calculate orchard intercrop water budget share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "number", minimum: 0 },
        treeAllocation: { type: "number", minimum: 0 },
        intercropAllocation: { type: "number", minimum: 0 },
        overlapCredit: { type: "number", minimum: 0 },
      },
      required: [
        "available",
        "treeAllocation",
        "intercropAllocation",
        "overlapCredit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netAllocated: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["netAllocated", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "treeAllocation",
          label: "Tree Allocation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intercropAllocation",
          label: "Intercrop Allocation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapCredit",
          label: "Overlap Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netAllocated",
          label: "Net Allocated",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orchardIntercropWaterBudgetShareTool.execute;
export default orchardIntercropWaterBudgetShareTool;
