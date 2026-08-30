import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Roughness70HzModulationMaximumLookupInput = Readonly<
  Record<string, never>
>;

export type Roughness70HzModulationMaximumLookupOutput = Readonly<{
  asperCarrierHertz: number;
  asperLevelDecibels: number;
  asperModulationDepth: number;
  evidenceScope: string;
  peakModulationHertz: number;
  reference: string;
  universalPeak: boolean;
}>;

const output: Roughness70HzModulationMaximumLookupOutput = {
  asperCarrierHertz: 1000,
  asperLevelDecibels: 60,
  asperModulationDepth: 1,
  evidenceScope:
    "The 70 Hz value is the modulation rate in the 1-asp reference stimulus and a near-maximum reported for some fully modulated high-carrier tones. It is not a universal roughness peak across carriers, modulation depth, spectra, levels, listeners, or procedures.",
  peakModulationHertz: 70,
  reference:
    "Fastl and Zwicker, Psychoacoustics: Facts and Models (2007), roughness definition and discussion.",
  universalPeak: false,
};

export const lookupRoughness70HzModulationMaximum =
  (): Roughness70HzModulationMaximumLookupOutput => output;

export const example = {
  input: {},
  output,
} satisfies ToolExample<
  Roughness70HzModulationMaximumLookupInput,
  Roughness70HzModulationMaximumLookupOutput
>;

export const roughness70HzModulationMaximumLookupTool = createSimpleTool({
  calculate: lookupRoughness70HzModulationMaximum,
  description:
    "Return the documented 70 Hz maximum of the 1-asp roughness reference while distinguishing that demonstration from a universal prediction.",
  id: "acoustics/roughness-70-hz-reference",
  inputs: [],
  outputs: [
    {
      id: "asperCarrierHertz",
      kind: "number",
      label: "1-asp carrier frequency",
      unit: "Hz",
    },
    {
      id: "asperLevelDecibels",
      kind: "number",
      label: "1-asp level",
      unit: "dB SPL",
    },
    {
      id: "asperModulationDepth",
      kind: "number",
      label: "1-asp modulation depth",
    },
    { id: "evidenceScope", kind: "string", label: "Evidence scope" },
    {
      id: "peakModulationHertz",
      kind: "number",
      label: "Reference peak modulation frequency",
      unit: "Hz",
    },
    { id: "reference", kind: "string", label: "Reference" },
    {
      id: "universalPeak",
      kind: "boolean",
      label: "Universal peak",
    },
  ],
  title: "Roughness 70 Hz Reference",
});

export const runRoughness70HzModulationMaximumLookup =
  roughness70HzModulationMaximumLookupTool.execute;
export default roughness70HzModulationMaximumLookupTool;
