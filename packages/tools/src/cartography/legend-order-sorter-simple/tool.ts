import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, topo } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly itemIds: readonly string[];
  readonly prerequisiteIndices: readonly number[];
  readonly dependentIndices: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "itemIds", label: "Item ids", kind: "stringList" },
  {
    id: "prerequisiteIndices",
    label: "Prerequisite indices",
    kind: "numberList",
  },
  { id: "dependentIndices", label: "Dependent indices", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return topo(i.itemIds, i.prerequisiteIndices, i.dependentIndices);
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    itemIds: ["a", "b", "c"],
    prerequisiteIndices: [2],
    dependentIndices: [0],
  },
  output: { result: { orderedItemIds: ["b", "c", "a"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/legend-order-sorter-simple",
  title: "Legend Item Order Topological Sorter Simple",
  description:
    "Stable Kahn topological legend ordering from explicit prerequisite edges; rejects cycles, does not infer cartographic semantics.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          orderedItemIds: { type: "array", items: { type: "string" } },
        },
        required: ["orderedItemIds"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
