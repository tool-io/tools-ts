import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const crystalPpmErrorExample = {
  input: { measuredHz: 8000100, nominalHz: 8000000 },
} satisfies ToolExample<{
  readonly measuredHz: number;
  readonly nominalHz: number;
}>;

export const crystalPpmErrorTool = createSimpleTool({
  id: "electronics/crystal-ppm-error",
  title: "Crystal PPM Error",
  description:
    "Compute the signed frequency error of a crystal oscillator in parts per million.",
  inputs: [
    { id: "nominalHz", label: "Nominal frequency", kind: "number", unit: "Hz" },
    {
      id: "measuredHz",
      label: "Measured frequency",
      kind: "number",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "ppmError",
      label: "Frequency error",
      kind: "number",
      unit: "ppm",
    },
  ],
  calculate: (input) => {
    const nominalHz = input.nominalHz as number;
    const measuredHz = input.measuredHz as number;
    if (!(nominalHz > 0))
      simpleError("nominalHz", "Nominal frequency must be positive.");
    if (!(measuredHz > 0))
      simpleError("measuredHz", "Measured frequency must be positive.");
    return { ppmError: ((measuredHz - nominalHz) / nominalHz) * 1e6 };
  },
});
export const runCrystalPpmError = crystalPpmErrorTool.execute;
export default crystalPpmErrorTool;
