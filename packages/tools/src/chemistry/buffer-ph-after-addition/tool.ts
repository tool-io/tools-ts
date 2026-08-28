import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bufferPhAfterAdditionExample = {
  input: { acidM: 1, baseM: 1, nAdd: 0.5, pKa: 4.76 },
} satisfies ToolExample<{
  readonly acidM: number;
  readonly baseM: number;
  readonly nAdd: number;
  readonly pKa: number;
}>;

export const bufferPhAfterAdditionTool = createSimpleTool({
  id: "chemistry/buffer-ph-after-addition",
  title: "Buffer pH After Addition",
  description:
    "Compute the buffer pH after adding strong base as pKa plus log10 of conjugate base over remaining weak acid.",
  inputs: [
    { id: "acidM", label: "Weak acid moles", kind: "number", unit: "mol" },
    { id: "baseM", label: "Conjugate base moles", kind: "number", unit: "mol" },
    {
      id: "nAdd",
      label: "Added strong base moles",
      kind: "number",
      unit: "mol",
    },
    { id: "pKa", label: "pKa of weak acid", kind: "number" },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const acidM = input.acidM as number;
    const baseM = input.baseM as number;
    const nAdd = input.nAdd as number;
    const pKa = input.pKa as number;
    if (!(acidM > 0)) simpleError("acidM", "Acid moles must be positive.");
    if (!(baseM > 0))
      simpleError("baseM", "Conjugate base moles must be positive.");
    if (!(nAdd > 0))
      simpleError("nAdd", "Added strong base moles must be positive.");
    if (!(nAdd < acidM))
      simpleError(
        "nAdd",
        "Added strong base must be less than the available acid moles.",
        "buffer_exhausted",
      );
    return { ph: pKa + Math.log10((baseM + nAdd) / (acidM - nAdd)) };
  },
});
export const runBufferPhAfterAddition = bufferPhAfterAdditionTool.execute;
export default bufferPhAfterAdditionTool;
