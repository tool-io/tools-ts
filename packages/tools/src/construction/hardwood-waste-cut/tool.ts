import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HardwoodWasteCutInput = Readonly<{
  readonly purchasedAreaM2: number;
  readonly installedAreaM2: number;
}>;
export type HardwoodWasteCutOutput = Readonly<{
  readonly wasteAreaM2: number;
}>;

export const calculateHardwoodWasteCut = (
  x: HardwoodWasteCutInput,
): HardwoodWasteCutOutput => {
  if (!Number.isFinite(x.purchasedAreaM2) || x.purchasedAreaM2 < 0)
    simpleError("purchasedAreaM2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.installedAreaM2) || x.installedAreaM2 < 0)
    simpleError("installedAreaM2", "Provide a finite number at least 0.");
  if (!(x.purchasedAreaM2 >= x.installedAreaM2))
    simpleError(
      "purchasedAreaM2",
      "Purchased area cannot be less than installed area.",
    );
  const wasteAreaM2 = x.purchasedAreaM2 - x.installedAreaM2;
  if (!Number.isFinite(wasteAreaM2))
    simpleError("wasteAreaM2", "The inputs produce an invalid result.");
  return { wasteAreaM2: Object.is(wasteAreaM2, -0) ? 0 : wasteAreaM2 };
};

export const example = {
  input: { purchasedAreaM2: 35, installedAreaM2: 30 },
  output: { wasteAreaM2: 5 },
} satisfies ToolExample<HardwoodWasteCutInput, HardwoodWasteCutOutput>;

export const tool = createSimpleTool({
  id: "construction/hardwood-waste-cut",
  title: "Hardwood Waste Cut",
  description:
    "Find flooring offcut and waste area by subtracting installed area from purchased material area.",
  inputs: [
    {
      id: "purchasedAreaM2",
      kind: "number",
      label: "Purchased area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "installedAreaM2",
      kind: "number",
      label: "Installed area",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wasteAreaM2",
      kind: "number",
      label: "Offcut and waste area",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateHardwoodWasteCut({
      purchasedAreaM2: input.purchasedAreaM2 as number,
      installedAreaM2: input.installedAreaM2 as number,
    }),
});
export const hardwoodWasteCutTool = tool;
export const runHardwoodWasteCut = tool.execute;
export default tool;
