import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const realizedHeritabilityExample = {
  input: { responseR: 4.8, selectionDifferenceS: 12 },
} satisfies ToolExample<{
  readonly responseR: number;
  readonly selectionDifferenceS: number;
}>;

export const realizedHeritabilityTool = createSimpleTool({
  id: "biology/realized-heritability",
  title: "Realized Heritability",
  description:
    "Compute realized heritability as the signed selection response divided by the selection difference.",
  inputs: [
    { id: "responseR", label: "Response R", kind: "number" },
    {
      id: "selectionDifferenceS",
      label: "Selection difference S",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "realizedHeritability",
      label: "Realized heritability",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const responseR = input.responseR as number;
    const selectionDifferenceS = input.selectionDifferenceS as number;
    if (selectionDifferenceS === 0)
      simpleError(
        "selectionDifferenceS",
        "Selection difference must not be zero.",
        "zero_selection",
      );
    return { realizedHeritability: responseR / selectionDifferenceS };
  },
});
export const runRealizedHeritability = realizedHeritabilityTool.execute;
export default realizedHeritabilityTool;
