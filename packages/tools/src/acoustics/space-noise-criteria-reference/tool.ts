import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return room-noise criterion selection cautions for occupied spaces.",
  entries: {
    selection: {
      source: "ASHRAE Handbook—HVAC Applications",
      statement:
        "Background-noise criteria depend on occupancy, communication needs, concentration, sleep, privacy, and the specified rating method.",
    },
    spectrum: {
      source: "ANSI/ASA S12.2 and ASHRAE guidance",
      statement:
        "Octave-band criteria can reveal rumble or hiss that one A-weighted level may hide.",
    },
    caution: {
      source: "ASHRAE and applicable building criteria",
      statement:
        "A room-type table is design guidance, not a universal legal limit; use the project brief and governing standard.",
    },
  },
  exampleTopic: "selection",
  id: "acoustics/space-noise-criteria-reference",
  title: "Space Noise Criteria Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
