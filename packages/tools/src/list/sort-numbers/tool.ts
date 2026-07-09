import { createSimpleTool } from "../../core/simple.js";
export const sortNumbersTool = createSimpleTool({
  id: "list/sort-numbers",
  title: "Sort Numbers Tool",
  description: "Sort finite numbers in ascending or descending numeric order.",
  inputs: [
    { id: "values", label: "Values", kind: "numberList" },
    {
      id: "descending",
      label: "Descending",
      kind: "boolean",
      default: false,
      required: false,
    },
  ],
  outputs: [{ id: "values", label: "Sorted values", kind: "numberList" }],
  calculate: (input) => {
    const values = [...(input.values as number[])].sort((a, b) => a - b);
    if (input.descending) values.reverse();
    return { values };
  },
});
export const runSortNumbers = sortNumbersTool.execute;
export default sortNumbersTool;
