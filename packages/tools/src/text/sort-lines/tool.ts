import { createSimpleTool } from "../../core/simple.js";
export const sortLinesTool = createSimpleTool({
  id: "text/sort-lines",
  title: "Sort Lines Tool",
  description:
    "Sort text lines with deterministic Unicode code-point ordering.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    {
      id: "descending",
      label: "Descending",
      kind: "boolean",
      default: false,
      required: false,
    },
  ],
  outputs: [{ id: "text", label: "Sorted lines", kind: "string" }],
  calculate: (input) => {
    const lines = (input.text as string).split(/\r\n|\r|\n/u).sort();
    if (input.descending) lines.reverse();
    return { text: lines.join("\n") };
  },
});
export const runSortLines = sortLinesTool.execute;
export default sortLinesTool;
