import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sum,
  exactProduct,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly availableDistinctLociPerRoom: readonly number[];
  readonly callerItemsPerLocus: number;
  readonly requiredItems: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "availableDistinctLociPerRoom",
    label: "Available distinct loci per room",
    kind: "numberList",
  },
  {
    id: "callerItemsPerLocus",
    label: "Caller items per locus",
    kind: "number",
  },
  { id: "requiredItems", label: "Required items", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.availableDistinctLociPerRoom.forEach((v) =>
    bounded(v, "loci", 0, 10000),
  );
  bounded(input.callerItemsPerLocus, "itemsperlocus", 1, 128);
  bounded(input.requiredItems, "items", 0, 1000000);
  const capacity = exactProduct(
    sum(input.availableDistinctLociPerRoom),
    input.callerItemsPerLocus,
  );
  return {
    totalCapacity: capacity,
    signedRemainingCapacity: capacity - input.requiredItems,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    availableDistinctLociPerRoom: [5, 3, 2],
    callerItemsPerLocus: 1,
    requiredItems: 12,
  },
  output: { result: { totalCapacity: 10, signedRemainingCapacity: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/method-of-loci-room-capacity-planner",
  title: "Method of Loci Room Capacity Planner",
  description:
    "Plan caller independently established distinct memory loci capacities, retaining shortfall; no automatic memory enhancement or architectural room inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
