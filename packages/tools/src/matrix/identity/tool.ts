import { createSimpleTool } from "../../core/simple.js";
export const identityTool = createSimpleTool({
  id: "matrix/identity",
  title: "Identity Matrix Generator",
  description:
    "Generate a square identity matrix within portable matrix limits.",
  inputs: [
    { id: "size", label: "Size", kind: "integer", minimum: 1, maximum: 128 },
  ],
  outputs: [
    {
      id: "matrix",
      label: "Identity matrix",
      kind: "matrix",
      format: "matrix",
    },
  ],
  calculate: (input) => {
    const size = input.size as number;
    return {
      matrix: Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, column) => (row === column ? 1 : 0)),
      ),
    };
  },
});
export const runIdentity = identityTool.execute;
export default identityTool;
