import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    resistivityOhmM: 1.72e-8,
    wireLengthM: 10,
    crossSectionM2: 0.000001,
  },
  output: { resistanceOhm: 0.172 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/transformer-winding-resistance-dc",
  title: "Transformer Winding DC Resistance",
  description:
    "Estimate DC winding resistance from conductor resistivity, total wire length, and copper cross-section: R=ρl/A. Supply resistivity at operating temperature; AC skin and proximity losses are excluded.",
  inputs: [
    {
      id: "resistivityOhmM",
      kind: "number",
      label: "Conductor resistivity (Ω·m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "wireLengthM",
      kind: "number",
      label: "Total wire length (m)",
      minimum: 0,
    },
    {
      id: "crossSectionM2",
      kind: "number",
      label: "Wire cross-section (m²)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "resistanceOhm", kind: "number", label: "Resistance ohm" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      resistanceOhm: (i.resistivityOhmM * i.wireLengthM) / i.crossSectionM2,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type TransformerWindingResistanceDcInput = Readonly<
  typeof example.input
>;
export type TransformerWindingResistanceDcOutput = Readonly<
  typeof example.output
>;
export const transformerWindingResistanceDcTool = tool;
export const runTransformerWindingResistanceDc = tool.execute;
export default tool;
