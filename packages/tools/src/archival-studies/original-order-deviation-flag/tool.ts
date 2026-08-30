import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, lines } from "../shared.js";
export type Input = Readonly<{
  readonly originalStableItemOrder: string;
  readonly currentStableItemOrder: string;
}>;
export type Output = Readonly<{
  readonly signedOrdinalDisplacements: readonly number[];
  readonly relativeOrderInversionCount: number;
  readonly originalOrderPreserved: boolean;
}>;
const inputFields = [
  {
    id: "originalStableItemOrder",
    label: "Original stable item order",
    kind: "string",
  },
  {
    id: "currentStableItemOrder",
    label: "Current stable item order",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const original = lines(input.originalStableItemOrder, "original"),
    current = lines(input.currentStableItemOrder, "current");
  if (
    new Set(original).size !== original.length ||
    new Set(current).size !== current.length ||
    original.length !== current.length
  )
    simpleError("order", "Unique matched item inventories required.");
  const map = new Map(current.map((s, i) => [s, i]));
  if (original.some((s) => !map.has(s)))
    simpleError("order", "Same stable item identities required.");
  const positions = original.map((s) => map.get(s)!);
  let inversions = 0;
  for (let i = 0; i < positions.length; i++)
    for (let j = i + 1; j < positions.length; j++)
      if (positions[i] > positions[j]) inversions++;
  return {
    signedOrdinalDisplacements: positions.map((v, i) => v - i),
    relativeOrderInversionCount: inversions,
    originalOrderPreserved: inversions === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originalStableItemOrder: "A\nB\nC",
  currentStableItemOrder: "B\nA\nC",
} satisfies Input;
export const exampleOutput = {
  signedOrdinalDisplacements: [1, -1, 0],
  relativeOrderInversionCount: 1,
  originalOrderPreserved: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/original-order-deviation-flag",
  title: "Original Order Preservation Deviation Flag Checker",
  description:
    "Audit actual original/current matched stable identities through displacements and pair inversions, rather than infer archival integrity from moved count; missing/duplicate identity is unresolved, not accepted.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedOrdinalDisplacements",
      label: "Signed ordinal displacements",
      kind: "numberList",
    },
    {
      id: "relativeOrderInversionCount",
      label: "Relative order inversion count",
      kind: "number",
    },
    {
      id: "originalOrderPreserved",
      label: "Original order preserved",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      originalStableItemOrder: value.originalStableItemOrder as string,
      currentStableItemOrder: value.currentStableItemOrder as string,
    }),
});
export const run = tool.execute;
export default tool;
