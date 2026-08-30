import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Distinguish early decay time from later reverberation-time regressions defined by ISO 3382.",
  entries: {
    edt: {
      source: "ISO 3382-1",
      statement:
        "EDT is derived from the initial 0 to -10 dB decay slope and extrapolated to a 60 dB decay time; it emphasizes the early subjective decay.",
    },
    t20: {
      source: "ISO 3382-1",
      statement:
        "T20 is obtained from a regression over -5 to -25 dB and extrapolated to 60 dB; it is not a literal 20 dB reverberation time.",
    },
    t30: {
      source: "ISO 3382-1",
      statement:
        "T30 is obtained from a regression over -5 to -35 dB and extrapolated to 60 dB; adequate decay range and regression quality are required.",
    },
  },
  exampleTopic: "edt",
  id: "acoustics/edt-late-decay-reference",
  title: "EDT and Late-Decay Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
