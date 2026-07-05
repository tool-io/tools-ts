import { createSimpleTool } from "../../core/simple.js";
export const chunkTool = createSimpleTool({
  id: "list/chunk",
  title: "List Chunk Tool",
  description:
    "Split a string list into consecutive chunks of a requested size.",
  inputs: [
    { id: "values", label: "Values", kind: "stringList" },
    { id: "size", label: "Chunk size", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "chunks",
      label: "Chunks",
      kind: "object",
      format: "string-list-chunks",
    },
  ],
  calculate: (input) => {
    const values = input.values as string[],
      size = input.size as number,
      chunks = [] as string[][];
    for (let index = 0; index < values.length; index += size)
      chunks.push(values.slice(index, index + size));
    return { chunks: { values: chunks } };
  },
});
export const runChunk = chunkTool.execute;
export default chunkTool;
