import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const principalTideConstituentPeriodLookupExample = {
  input: { constituentSymbol: "M2" },
  output: { periodHours: 12.4206, speciesNote: "principal lunar semidiurnal" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const principalTideConstituentPeriodLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ constituentSymbol }) => {
      const table = {
        M2: {
          periodHours: 12.4206,
          speciesNote: "principal lunar semidiurnal",
        },
        S2: { periodHours: 12.0, speciesNote: "principal solar semidiurnal" },
        N2: {
          periodHours: 12.6583,
          speciesNote: "larger lunar elliptic semidiurnal",
        },
        K1: { periodHours: 23.9345, speciesNote: "lunar-solar diurnal" },
        O1: { periodHours: 25.8193, speciesNote: "principal lunar diurnal" },
      }[constituentSymbol];
      if (!table)
        simpleError("constituentSymbol", "Unknown constituent symbol.");
      return table;
    })(input as never) as Record<string, unknown>,
  description:
    "Periods of the principal tidal constituents relevant to tidal-triggering studies.",
  id: "seismology/principal-tide-constituent-period-lookup",
  inputs: [
    {
      description: "Constituent symbol (M2, S2, N2, K1, O1).",
      id: "constituentSymbol",
      kind: "string",
      label: "symbol",
    },
  ],
  outputs: [
    {
      description: "Constituent period.",
      id: "periodHours",
      kind: "number",
      label: "T",
      unit: "h",
    },
    {
      description: "Semidiurnal or diurnal.",
      id: "speciesNote",
      kind: "string",
      label: "Species",
    },
  ],
  title: "Principal Tide Constituent Period Lookup",
});
export const runPrincipalTideConstituentPeriodLookup =
  principalTideConstituentPeriodLookupTool.execute;
export { principalTideConstituentPeriodLookupExample as example };
export default principalTideConstituentPeriodLookupTool;
