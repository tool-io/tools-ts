import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParkettBedarfVerschnittInput = Readonly<{
  readonly netFloorSquareMeters: number;
  readonly wastePercent: number;
}>;
export type ParkettBedarfVerschnittOutput = Readonly<{
  readonly purchaseSquareMeters: number;
}>;

export const calculateParkettBedarfVerschnitt = (
  x: ParkettBedarfVerschnittInput,
): ParkettBedarfVerschnittOutput => {
  if (!Number.isFinite(x.netFloorSquareMeters) || x.netFloorSquareMeters < 0)
    simpleError("netFloorSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const purchaseSquareMeters =
    x.netFloorSquareMeters * (1 + x.wastePercent / 100);
  if (!Number.isFinite(purchaseSquareMeters))
    simpleError(
      "purchaseSquareMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    purchaseSquareMeters: Object.is(purchaseSquareMeters, -0)
      ? 0
      : purchaseSquareMeters,
  };
};

export const example = {
  input: { netFloorSquareMeters: 30, wastePercent: 10 },
  output: { purchaseSquareMeters: 33 },
} satisfies ToolExample<
  ParkettBedarfVerschnittInput,
  ParkettBedarfVerschnittOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/parkett-bedarf-verschnitt",
  title: "Parkett Bedarf Verschnitt",
  description:
    "Parquet purchase area from net floor area plus an explicit cutting and damage allowance percentage.",
  inputs: [
    {
      id: "netFloorSquareMeters",
      kind: "number",
      label: "Net Floor Square Meters",
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
    calculateParkettBedarfVerschnitt({
      netFloorSquareMeters: input.netFloorSquareMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const parkettBedarfVerschnittTool = tool;
export const runParkettBedarfVerschnitt = tool.execute;
export default tool;
