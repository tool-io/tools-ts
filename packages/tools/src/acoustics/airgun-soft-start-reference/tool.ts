import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the purpose and project-specific nature of seismic-airgun ramp-up mitigation.",
  entries: {
    purpose: {
      source: "JNCC seismic survey guidelines and project permits",
      statement:
        "A soft start or ramp-up begins with reduced acoustic output and increases it progressively to provide an opportunity for animals to move away.",
    },
    procedure: {
      source: "Applicable marine permit and mitigation plan",
      statement:
        "Duration, source sequence, monitoring, delay, shutdown, and restart rules are jurisdiction- and permit-specific.",
    },
    caution: {
      source: "Marine environmental-assessment guidance",
      statement:
        "Ramp-up is one mitigation element and does not establish absence of exposure or biological effect.",
    },
  },
  exampleTopic: "purpose",
  id: "acoustics/airgun-soft-start-reference",
  title: "Airgun Soft-Start Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
