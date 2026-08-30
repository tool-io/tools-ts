import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaminatVerschnittInput = Readonly<{
  readonly purchasedSquareMeters: number;
  readonly installedSquareMeters: number;
}>;
export type LaminatVerschnittOutput = Readonly<{
  readonly wastePercent: number;
}>;

export const calculateLaminatVerschnitt = (
  x: LaminatVerschnittInput,
): LaminatVerschnittOutput => {
  if (!Number.isFinite(x.purchasedSquareMeters) || x.purchasedSquareMeters < 0)
    simpleError("purchasedSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.installedSquareMeters) || x.installedSquareMeters < 0)
    simpleError("installedSquareMeters", "Provide a finite number at least 0.");
  if (x.installedSquareMeters > x.purchasedSquareMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const wastePercent =
    (100 * (x.purchasedSquareMeters - x.installedSquareMeters)) /
    x.purchasedSquareMeters;
  if (!Number.isFinite(wastePercent))
    simpleError(
      "wastePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { wastePercent: Object.is(wastePercent, -0) ? 0 : wastePercent };
};

export const example = {
  input: { purchasedSquareMeters: 33, installedSquareMeters: 30 },
  output: { wastePercent: 9.090909090909092 },
} satisfies ToolExample<LaminatVerschnittInput, LaminatVerschnittOutput>;

export const tool = createSimpleTool({
  id: "carpentry/laminat-verschnitt",
  title: "Laminat Verschnitt",
  description:
    "Laminate waste percentage from total purchased panel area and usable area installed.",
  inputs: [
    {
      id: "purchasedSquareMeters",
      kind: "number",
      label: "Purchased Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "installedSquareMeters",
      kind: "number",
      label: "Installed Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "wastePercent", kind: "number", label: "Waste Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculateLaminatVerschnitt({
      purchasedSquareMeters: input.purchasedSquareMeters as number,
      installedSquareMeters: input.installedSquareMeters as number,
    }),
});
export const laminatVerschnittTool = tool;
export const runLaminatVerschnitt = tool.execute;
export default tool;
