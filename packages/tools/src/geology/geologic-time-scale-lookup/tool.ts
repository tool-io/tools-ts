import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

type PeriodEntry = {
  readonly endMa: number;
  readonly era: string;
  readonly period: string;
  readonly startMa: number;
};

const PERIODS_YOUNGEST_FIRST: readonly PeriodEntry[] = [
  { period: "Quaternary", era: "Cenozoic", startMa: 2.58, endMa: 0 },
  { period: "Neogene", era: "Cenozoic", startMa: 23.03, endMa: 2.58 },
  { period: "Paleogene", era: "Cenozoic", startMa: 66, endMa: 23.03 },
  { period: "Cretaceous", era: "Mesozoic", startMa: 145, endMa: 66 },
  { period: "Jurassic", era: "Mesozoic", startMa: 201.4, endMa: 145 },
  { period: "Triassic", era: "Mesozoic", startMa: 251.902, endMa: 201.4 },
  { period: "Permian", era: "Paleozoic", startMa: 298.9, endMa: 251.902 },
  { period: "Carboniferous", era: "Paleozoic", startMa: 358.9, endMa: 298.9 },
  { period: "Devonian", era: "Paleozoic", startMa: 419.2, endMa: 358.9 },
  { period: "Silurian", era: "Paleozoic", startMa: 443.8, endMa: 419.2 },
  { period: "Ordovician", era: "Paleozoic", startMa: 485.4, endMa: 443.8 },
  { period: "Cambrian", era: "Paleozoic", startMa: 538.8, endMa: 485.4 },
  { period: "Ediacaran", era: "Neoproterozoic", startMa: 635, endMa: 538.8 },
];

export type GeologicTimeScaleLookupInput = {
  readonly ageMa: number;
};

export type GeologicTimeScaleLookupOutput = {
  readonly endMa: number;
  readonly era: string;
  readonly period: string;
  readonly startMa: number;
};

export const calculateGeologicTimeScaleLookup = (
  input: GeologicTimeScaleLookupInput,
): GeologicTimeScaleLookupOutput => {
  if (!(input.ageMa >= 0 && input.ageMa <= 635))
    simpleError(
      "ageMa",
      "Age must lie between 0 and 635 million years ago for this lookup.",
      "invalid_age",
    );
  const entry = PERIODS_YOUNGEST_FIRST.find(
    (candidate) =>
      input.ageMa <= candidate.startMa && input.ageMa >= candidate.endMa,
  );
  const period =
    entry ??
    simpleError(
      "ageMa",
      "Age does not match any period in the lookup table.",
      "invalid_age",
    );
  return {
    endMa: period.endMa,
    era: period.era,
    period: period.period,
    startMa: period.startMa,
  };
};

export const geologicTimeScaleLookupExample = {
  input: { ageMa: 200 },
  output: { endMa: 145, era: "Mesozoic", period: "Jurassic", startMa: 201.4 },
} satisfies ToolExample<
  GeologicTimeScaleLookupInput,
  GeologicTimeScaleLookupOutput
>;

export const geologicTimeScaleLookupTool = createSimpleTool({
  id: "geology/geologic-time-scale-lookup",
  title: "Geologic Time Scale Lookup",
  description:
    "Map an age in millions of years ago (ICS boundaries) to its Phanerozoic plus Ediacaran period, era and boundary ages; boundary ages belong to the younger period.",
  inputs: [
    {
      description:
        "Geologic age in millions of years before present, 0 to 635 Ma.",
      id: "ageMa",
      kind: "number",
      label: "Age",
      maximum: 635,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Geologic period containing the age.",
      id: "period",
      kind: "string",
      label: "Period",
    },
    {
      description: "Era containing the period.",
      id: "era",
      kind: "string",
      label: "Era",
    },
    {
      description: "Base (older) boundary of the period in Ma.",
      id: "startMa",
      kind: "number",
      label: "Start",
    },
    {
      description: "Top (younger) boundary of the period in Ma.",
      id: "endMa",
      kind: "number",
      label: "End",
    },
  ],
  calculate: (input) =>
    calculateGeologicTimeScaleLookup(
      input as unknown as GeologicTimeScaleLookupInput,
    ),
});

export const runGeologicTimeScaleLookup = geologicTimeScaleLookupTool.execute;
export default geologicTimeScaleLookupTool;
