import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const veneerPressPressureExample = {
  input: { areaM2: 0.25, forceNewtons: 10000 },
  output: { pressureBar: 0.4 },
} satisfies ToolExample<
  { readonly areaM2: number; readonly forceNewtons: number },
  { readonly pressureBar: number }
>;

export const veneerPressPressureTool = createSimpleTool({
  id: "carpentry/furnierpresse-druck-bar",
  title: "Veneer Press Pressure Calculator",
  description:
    "Compute platen pressure in bar from press force and press area.",
  inputs: [
    {
      description: "Press force in newtons.",
      id: "forceNewtons",
      kind: "number",
      label: "Force",
      unit: "N",
    },
    {
      description: "Press platen area in square meters.",
      id: "areaM2",
      kind: "number",
      label: "Area",
      unit: "m²",
    },
  ],
  outputs: [
    {
      description: "Pressure on the workpiece in bar.",
      id: "pressureBar",
      kind: "number",
      label: "Pressure",
      unit: "bar",
    },
  ],
  calculate: (input) => {
    const forceNewtons = input.forceNewtons as number;
    const areaM2 = input.areaM2 as number;
    if (forceNewtons <= 0)
      simpleError(
        "forceNewtons",
        "Force must be positive.",
        "must_be_positive",
      );
    if (areaM2 <= 0)
      simpleError("areaM2", "Area must be positive.", "must_be_positive");
    return { pressureBar: forceNewtons / (areaM2 * 100000) };
  },
});
export const runVeneerPressPressure = veneerPressPressureTool.execute;
export default veneerPressPressureTool;
