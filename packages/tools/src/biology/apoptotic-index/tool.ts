import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const apoptoticIndexExample = {
  input: { apoptoticCells: 75, mitoticCells: 150 },
} satisfies ToolExample<{
  readonly apoptoticCells: number;
  readonly mitoticCells: number;
}>;

export const apoptoticIndexTool = createSimpleTool({
  id: "biology/apoptotic-index",
  title: "Apoptotic Index",
  description:
    "Compute the apoptotic index as the ratio of apoptotic cells to mitotic cells.",
  inputs: [
    {
      id: "apoptoticCells",
      label: "Apoptotic cells",
      kind: "integer",
      minimum: 0,
    },
    { id: "mitoticCells", label: "Mitotic cells", kind: "integer", minimum: 0 },
  ],
  outputs: [{ id: "apoptoticIndex", label: "Apoptotic index", kind: "number" }],
  calculate: (input) => {
    const apoptoticCells = input.apoptoticCells as number;
    const mitoticCells = input.mitoticCells as number;
    if (mitoticCells <= 0)
      simpleError(
        "mitoticCells",
        "Mitotic count must be positive.",
        "invalid_counts",
      );
    return { apoptoticIndex: apoptoticCells / mitoticCells };
  },
});
export const runApoptoticIndex = apoptoticIndexTool.execute;
export default apoptoticIndexTool;
