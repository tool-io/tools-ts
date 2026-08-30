import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InsulationBlownBagsInput = Readonly<{
  readonly targetVolumeM3: number;
  readonly yieldPerBagM3: number;
}>;
export type InsulationBlownBagsOutput = Readonly<{
  readonly bagCount: number;
}>;

export const calculateInsulationBlownBags = (
  x: InsulationBlownBagsInput,
): InsulationBlownBagsOutput => {
  if (!Number.isFinite(x.targetVolumeM3) || x.targetVolumeM3 < 0)
    simpleError("targetVolumeM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.yieldPerBagM3) || x.yieldPerBagM3 < 0)
    simpleError("yieldPerBagM3", "Provide a finite number at least 0.");
  if (!(x.yieldPerBagM3 > 0))
    simpleError("yieldPerBagM3", "Yield per bag must be positive.");
  const bagCount = Math.ceil(x.targetVolumeM3 / x.yieldPerBagM3);
  if (!Number.isFinite(bagCount) || !Number.isSafeInteger(bagCount))
    simpleError("bagCount", "The inputs produce an invalid result.");
  return { bagCount: Object.is(bagCount, -0) ? 0 : bagCount };
};

export const example = {
  input: { targetVolumeM3: 5, yieldPerBagM3: 0.5 },
  output: { bagCount: 10 },
} satisfies ToolExample<InsulationBlownBagsInput, InsulationBlownBagsOutput>;

export const tool = createSimpleTool({
  id: "construction/insulation-blown-bags",
  title: "Insulation Blown Bags",
  description:
    "Round up blown-insulation bags using target cavity volume and specified installed-volume yield per bag.",
  inputs: [
    {
      id: "targetVolumeM3",
      kind: "number",
      label: "Target installed volume",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "yieldPerBagM3",
      kind: "number",
      label: "Installed yield per bag",
      unit: "m³",
      minimum: 0,
    },
  ],
  outputs: [{ id: "bagCount", kind: "integer", label: "Bags required" }],
  calculate: (input) =>
    calculateInsulationBlownBags({
      targetVolumeM3: input.targetVolumeM3 as number,
      yieldPerBagM3: input.yieldPerBagM3 as number,
    }),
});
export const insulationBlownBagsTool = tool;
export const runInsulationBlownBags = tool.execute;
export default tool;
