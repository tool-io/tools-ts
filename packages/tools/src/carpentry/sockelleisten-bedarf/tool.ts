import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SockelleistenBedarfInput = Readonly<{
  readonly perimeterMeters: number;
  readonly openingMeters: number;
  readonly wastePercent: number;
}>;
export type SockelleistenBedarfOutput = Readonly<{
  readonly purchaseMeters: number;
}>;

export const calculateSockelleistenBedarf = (
  x: SockelleistenBedarfInput,
): SockelleistenBedarfOutput => {
  if (!Number.isFinite(x.perimeterMeters) || x.perimeterMeters < 0)
    simpleError("perimeterMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.openingMeters) || x.openingMeters < 0)
    simpleError("openingMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  if (x.openingMeters > x.perimeterMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const purchaseMeters =
    (x.perimeterMeters - x.openingMeters) * (1 + x.wastePercent / 100);
  if (!Number.isFinite(purchaseMeters))
    simpleError(
      "purchaseMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { purchaseMeters: Object.is(purchaseMeters, -0) ? 0 : purchaseMeters };
};

export const example = {
  input: { perimeterMeters: 20, openingMeters: 2, wastePercent: 10 },
  output: { purchaseMeters: 19.8 },
} satisfies ToolExample<SockelleistenBedarfInput, SockelleistenBedarfOutput>;

export const tool = createSimpleTool({
  id: "carpentry/sockelleisten-bedarf",
  title: "Sockelleisten Bedarf",
  description:
    "Skirting length for a room from perimeter minus untrimmed opening widths plus a chosen cutting-waste percentage.",
  inputs: [
    {
      id: "perimeterMeters",
      kind: "number",
      label: "Perimeter Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "openingMeters",
      kind: "number",
      label: "Opening Meters",
      unit: "m",
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
      id: "purchaseMeters",
      kind: "number",
      label: "Purchase Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateSockelleistenBedarf({
      perimeterMeters: input.perimeterMeters as number,
      openingMeters: input.openingMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const sockelleistenBedarfTool = tool;
export const runSockelleistenBedarf = tool.execute;
export default tool;
