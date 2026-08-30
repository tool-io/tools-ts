import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly partnerAllocations: readonly number[];
  readonly partnershipTotal: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly allocatedTotal: number;
  readonly difference: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.partnerAllocations.length === 0)
    simpleError(
      "partnerAllocations",
      "At least one partner allocation is required.",
      "empty_allocations",
    );
  const allocatedTotal = input.partnerAllocations.reduce((a, b) => a + b, 0);
  const difference = allocatedTotal - input.partnershipTotal;
  return {
    allocatedTotal,
    difference,
    withinTolerance: Math.abs(difference) <= input.tolerance,
  };
};

export const exampleInput = {
  partnerAllocations: [400, 600],
  partnershipTotal: 1000,
  tolerance: 0,
} satisfies Input;
export const exampleOutput = {
  allocatedTotal: 1000,
  difference: 0,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      partnerAllocations: input.partnerAllocations as readonly number[],
      partnershipTotal: input.partnershipTotal as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Check whether partner allocations reconcile to the partnership total.",
  id: "taxation/partnership-allocation-check",
  inputs: [
    {
      id: "partnerAllocations",
      label: "Partner allocations",
      kind: "numberList",
    },
    { id: "partnershipTotal", label: "Partnership total", kind: "number" },
    {
      id: "tolerance",
      label: "Allowed difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "allocatedTotal", label: "Allocated total", kind: "number" },
    { id: "difference", label: "Allocation difference", kind: "number" },
    {
      id: "withinTolerance",
      label: "Within supplied tolerance",
      kind: "boolean",
    },
  ],
  title: "Partnership Allocation Check",
});

export const run = tool.execute;
export default tool;
