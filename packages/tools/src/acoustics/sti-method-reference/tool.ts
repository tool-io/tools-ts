import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Summarize the scope and limitations of the standardized STI method.",
  entries: {
    scope: {
      source: "IEC 60268-16:2020",
      statement:
        "STI rates speech-transmission quality from reductions in modulation transfer across octave bands; it is not calculated from broadband signal-to-noise ratio alone.",
    },
    methods: {
      source: "IEC 60268-16:2020",
      statement:
        "IEC 60268-16 specifies direct and indirect measurement and prediction approaches, including STIPA under defined conditions.",
    },
    limitations: {
      source: "IEC 60268-16:2020",
      statement:
        "Language, talker effort, hearing ability, non-linear systems, fluctuating noise, and public-address processing can require method-specific cautions.",
    },
  },
  exampleTopic: "scope",
  id: "acoustics/sti-method-reference",
  title: "Speech Transmission Index Method Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
