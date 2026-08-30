import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FurnierBedarfVerschnittInput = Readonly<{
  readonly netSquareMeters: number;
  readonly wastePercent: number;
}>;
export type FurnierBedarfVerschnittOutput = Readonly<{
  readonly purchaseSquareMeters: number;
}>;

export const calculateFurnierBedarfVerschnitt = (
  x: FurnierBedarfVerschnittInput,
): FurnierBedarfVerschnittOutput => {
  if (!Number.isFinite(x.netSquareMeters) || x.netSquareMeters < 0)
    simpleError("netSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const purchaseSquareMeters = x.netSquareMeters * (1 + x.wastePercent / 100);
  if (!Number.isFinite(purchaseSquareMeters))
    simpleError(
      "purchaseSquareMeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    purchaseSquareMeters: Object.is(purchaseSquareMeters, -0)
      ? 0
      : purchaseSquareMeters,
  };
};

export const example = {
  input: { netSquareMeters: 10, wastePercent: 20 },
  output: { purchaseSquareMeters: 12 },
} satisfies ToolExample<
  FurnierBedarfVerschnittInput,
  FurnierBedarfVerschnittOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/furnier-bedarf-verschnitt",
  title: "Furnier Bedarf Verschnitt",
  description:
    "Veneer purchase area including a user-specified cutting-waste allowance; excludes grain matching and defects.",
  inputs: [
    {
      id: "netSquareMeters",
      kind: "number",
      label: "Net Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste Percent",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "purchaseSquareMeters",
      kind: "number",
      label: "Purchase Square Meters",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateFurnierBedarfVerschnitt({
      netSquareMeters: input.netSquareMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const furnierBedarfVerschnittTool = tool;
export const runFurnierBedarfVerschnitt = tool.execute;
export default tool;
