import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const phFromHExample = {
  input: { hPlusMolPerL: 1e-7 },
} satisfies ToolExample<{
  readonly hPlusMolPerL: number;
}>;

export const phFromHTool = createSimpleTool({
  id: "chemistry/ph-from-h",
  title: "pH From H Plus",
  description:
    "Compute pH as the negative base-10 logarithm of the hydrogen ion concentration.",
  inputs: [
    {
      id: "hPlusMolPerL",
      label: "Hydrogen ion concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const hPlusMolPerL = input.hPlusMolPerL as number;
    if (!(hPlusMolPerL > 0))
      simpleError(
        "hPlusMolPerL",
        "Hydrogen ion concentration must be positive.",
      );
    return { ph: -Math.log10(hPlusMolPerL) };
  },
});
export const runPhFromH = phFromHTool.execute;
export default phFromHTool;
