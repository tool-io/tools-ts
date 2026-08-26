import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NeonatalPostneonatalSplitLookupInput = {
  readonly infantDeaths: number;
  readonly neonatalDeaths: number;
  readonly liveBirths: number;
};

export type NeonatalPostneonatalSplitLookupOutput = {
  readonly neonatalRate: number;
  readonly postneonatalRate: number;
  readonly neonatalSharePercent: number;
};

export const calculateNeonatalPostneonatalSplitLookup = (
  input: NeonatalPostneonatalSplitLookupInput,
): NeonatalPostneonatalSplitLookupOutput => {
  if (!(input.infantDeaths >= 0))
    simpleError(
      "infantDeaths",
      "Infant deaths must be non-negative.",
      "invalid_deaths",
    );
  if (!(input.neonatalDeaths >= 0))
    simpleError(
      "neonatalDeaths",
      "Neonatal deaths must be non-negative.",
      "invalid_deaths",
    );
  if (input.neonatalDeaths > input.infantDeaths)
    simpleError(
      "neonatalDeaths",
      "Neonatal deaths cannot exceed total infant deaths.",
      "invalid_deaths",
    );
  if (!(input.liveBirths > 0))
    simpleError(
      "liveBirths",
      "Live births must be greater than zero.",
      "invalid_births",
    );
  const neonatalRate = (input.neonatalDeaths / input.liveBirths) * 1000;
  const postneonatalRate =
    ((input.infantDeaths - input.neonatalDeaths) / input.liveBirths) * 1000;
  const neonatalSharePercent =
    input.infantDeaths === 0
      ? 0
      : (input.neonatalDeaths / input.infantDeaths) * 100;
  return { neonatalRate, postneonatalRate, neonatalSharePercent };
};

export const neonatalPostneonatalSplitLookupExample = {
  input: { infantDeaths: 3000, neonatalDeaths: 1800, liveBirths: 100000 },
  output: { neonatalRate: 18, postneonatalRate: 12, neonatalSharePercent: 60 },
} satisfies ToolExample<
  NeonatalPostneonatalSplitLookupInput,
  NeonatalPostneonatalSplitLookupOutput
>;

export const neonatalPostneonatalSplitLookupTool = createSimpleTool({
  id: "demography/neonatal-postneonatal-split-lookup",
  title: "Neonatal Postneonatal Split Lookup",
  description:
    "Split the infant mortality rate into its neonatal component (deaths under 28 days) and postneonatal component per thousand live births, with the neonatal share of infant deaths.",
  inputs: [
    {
      description: "Total deaths under one year of age.",
      id: "infantDeaths",
      kind: "number",
      label: "Infant deaths",
      minimum: 0,
    },
    {
      description: "Deaths at ages under 28 days.",
      id: "neonatalDeaths",
      kind: "number",
      label: "Neonatal deaths",
      minimum: 0,
    },
    {
      description: "Live births in the year.",
      id: "liveBirths",
      kind: "number",
      label: "Live births",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Neonatal mortality rate per 1000 live births.",
      id: "neonatalRate",
      kind: "number",
      label: "NMR",
    },
    {
      description: "Postneonatal mortality rate per 1000 live births.",
      id: "postneonatalRate",
      kind: "number",
      label: "PMR",
    },
    {
      description: "Neonatal share of all infant deaths in percent.",
      id: "neonatalSharePercent",
      kind: "number",
      label: "Share",
    },
  ],
  calculate: (input) =>
    calculateNeonatalPostneonatalSplitLookup(
      input as unknown as NeonatalPostneonatalSplitLookupInput,
    ),
});

export const runNeonatalPostneonatalSplitLookup =
  neonatalPostneonatalSplitLookupTool.execute;
export default neonatalPostneonatalSplitLookupTool;
