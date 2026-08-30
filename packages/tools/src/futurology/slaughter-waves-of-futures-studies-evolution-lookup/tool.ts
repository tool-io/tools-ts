import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const waves = {
  earlyPractice: {
    caution:
      "Early work is historically situated and should not be treated as a complete map of the field.",
    development:
      "Foresight grows from scattered speculation toward repeated studies of possible futures.",
    label: "early practice",
  },
  systematic: {
    caution:
      "Systematic methods still depend on assumptions, data quality, and participation.",
    development:
      "Methods formalize horizon selection, scenario construction, and evidence use.",
    label: "systematic methods",
  },
  participatory: {
    caution:
      "Participation does not remove power differences or guarantee representative outcomes.",
    development:
      "Practitioners expand expert methods through stakeholder and public participation.",
    label: "participatory practice",
  },
  integrated: {
    caution:
      "Integration remains uneven across institutions, disciplines, and jurisdictions.",
    development:
      "Foresight combines methods, participation, strategy, monitoring, and policy feedback.",
    label: "integrated practice",
  },
} as const;

export type FuturesStudyWave = keyof typeof waves;

export type SlaughterWaveInput = {
  readonly wave: FuturesStudyWave;
};

export type SlaughterWaveOutput = {
  readonly caution: string;
  readonly development: string;
  readonly wave: FuturesStudyWave;
  readonly waveLabel: string;
};

export const lookupSlaughterFuturesStudyWave = (
  input: SlaughterWaveInput,
): SlaughterWaveOutput => {
  const wave = waves[input.wave];
  return {
    caution: wave.caution,
    development: wave.development,
    wave: input.wave,
    waveLabel: wave.label,
  };
};

export const slaughterWaveExample = {
  input: { wave: "participatory" },
  output: {
    caution:
      "Participation does not remove power differences or guarantee representative outcomes.",
    development:
      "Practitioners expand expert methods through stakeholder and public participation.",
    wave: "participatory",
    waveLabel: "participatory practice",
  },
} satisfies ToolExample<SlaughterWaveInput, SlaughterWaveOutput>;

export const slaughterWaveTool = createSimpleTool({
  calculate: (input) =>
    lookupSlaughterFuturesStudyWave({ wave: input.wave as FuturesStudyWave }),
  description:
    "Look up a simplified development wave, label, and caution in the evolution of futures-studies practice.",
  id: "futurology/slaughter-waves-of-futures-studies-evolution-lookup",
  inputs: [
    {
      enum: ["earlyPractice", "systematic", "participatory", "integrated"],
      id: "wave",
      kind: "string",
      label: "Futures-studies wave",
    },
  ],
  outputs: [
    { id: "caution", kind: "string", label: "Wave caution" },
    { id: "development", kind: "string", label: "Practice development" },
    { id: "wave", kind: "string", label: "Futures-studies wave" },
    { id: "waveLabel", kind: "string", label: "Wave label" },
  ],
  title: "Slaughter Waves of Futures Studies Evolution Lookup",
});

export const runSlaughterWave = slaughterWaveTool.execute;
export default slaughterWaveTool;
