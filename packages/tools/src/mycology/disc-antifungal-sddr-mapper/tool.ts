import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const discSddrMapperExample = {
  input: {
    resistantMaximumMm: 14,
    susceptibleMinimumMm: 20,
    zoneDiameterMm: 22,
  },
  output: { zoneCategory: "susceptible" },
} satisfies ToolExample<
  {
    readonly resistantMaximumMm: number;
    readonly susceptibleMinimumMm: number;
    readonly zoneDiameterMm: number;
  },
  { readonly zoneCategory: string }
>;

export const discSddrMapperTool = createSimpleTool({
  id: "mycology/disc-antifungal-sddr-mapper",
  title: "Disc SDD/R Mapper",
  description:
    "Map an antifungal disc-diffusion zone using organism-, agent-, and method-specific breakpoints supplied from the applicable current standard.",
  inputs: [
    {
      id: "zoneDiameterMm",
      kind: "number",
      label: "Zone diameter",
      minimum: 0,
    },
    {
      id: "resistantMaximumMm",
      kind: "number",
      label: "Resistant maximum",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "susceptibleMinimumMm",
      kind: "number",
      label: "Susceptible minimum",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      enum: ["resistant", "susceptible-dose-dependent", "susceptible"],
      id: "zoneCategory",
      kind: "string",
      label: "Zone category",
    },
  ],
  calculate: (input) => {
    const zoneDiameterMm = input.zoneDiameterMm as number;
    const resistantMaximumMm = input.resistantMaximumMm as number;
    const susceptibleMinimumMm = input.susceptibleMinimumMm as number;
    if (!(susceptibleMinimumMm > resistantMaximumMm))
      simpleError(
        "susceptibleMinimumMm",
        "The susceptible minimum must exceed the resistant maximum.",
      );
    const zoneCategory =
      zoneDiameterMm <= resistantMaximumMm
        ? "resistant"
        : zoneDiameterMm < susceptibleMinimumMm
          ? "susceptible-dose-dependent"
          : "susceptible";
    return { zoneCategory };
  },
});
export const runDiscSddrMapper = discSddrMapperTool.execute;
export default discSddrMapperTool;
