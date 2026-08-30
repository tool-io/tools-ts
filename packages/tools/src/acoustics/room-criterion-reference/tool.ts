import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Distinguish RC-family ratings and diagnostic descriptors without reproducing proprietary or edition-specific tables.",
  entries: {
    rating: {
      source: "ASHRAE Handbook—HVAC Applications",
      statement:
        "Room Criterion methods evaluate octave-band HVAC background sound and assign a numerical criterion near the speech-frequency average.",
    },
    quality: {
      source: "ASHRAE Handbook—HVAC Applications",
      statement:
        "RC diagnostic descriptors can flag spectra perceived as rumble, hiss, or vibration; the applicable Mark I or Mark II procedure must be identified.",
    },
    caution: {
      source: "ASHRAE Handbook—HVAC Applications",
      statement:
        "An RC number is not interchangeable with NC or NCB, and compliance requires the specified edition and octave-band data.",
    },
  },
  exampleTopic: "rating",
  id: "acoustics/room-criterion-reference",
  title: "Room Criterion Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
