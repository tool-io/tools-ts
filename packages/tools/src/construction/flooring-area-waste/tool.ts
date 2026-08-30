import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlooringAreaWasteInput = Readonly<{
  readonly netAreaM2: number;
  readonly wastePercent: number;
}>;
export type FlooringAreaWasteOutput = Readonly<{
  readonly materialAreaM2: number;
}>;

export const calculateFlooringAreaWaste = (
  x: FlooringAreaWasteInput,
): FlooringAreaWasteOutput => {
  if (!Number.isFinite(x.netAreaM2) || x.netAreaM2 < 0)
    simpleError("netAreaM2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const materialAreaM2 = x.netAreaM2 * (1 + x.wastePercent / 100);
  if (!Number.isFinite(materialAreaM2))
    simpleError("materialAreaM2", "The inputs produce an invalid result.");
  return { materialAreaM2: Object.is(materialAreaM2, -0) ? 0 : materialAreaM2 };
};

export const example = {
  input: { netAreaM2: 30, wastePercent: 10 },
  output: { materialAreaM2: 33 },
} satisfies ToolExample<FlooringAreaWasteInput, FlooringAreaWasteOutput>;

export const tool = createSimpleTool({
  id: "construction/flooring-area-waste",
  title: "Flooring Area With Waste",
  description:
    "Estimate flooring material area from net floor area and an explicit cut-and-waste percentage.",
  inputs: [
    {
      id: "netAreaM2",
      kind: "number",
      label: "Net floor area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Cut-and-waste allowance",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "materialAreaM2",
      kind: "number",
      label: "Material area",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateFlooringAreaWaste({
      netAreaM2: input.netAreaM2 as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const flooringAreaWasteTool = tool;
export const runFlooringAreaWaste = tool.execute;
export default tool;
