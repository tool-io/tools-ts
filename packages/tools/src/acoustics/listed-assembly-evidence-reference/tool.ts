import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return evidence checks for a listed acoustic or fire-rated assembly without claiming that a listing supplies a universal flanking correction.",
  entries: {
    identifier: {
      source: "UL Product iQ or the applicable listing body",
      statement:
        "Verify the exact listing or design identifier, edition, manufacturer, construction, and rating scope against the listing service record.",
    },
    configuration: {
      source: "Applicable listed design",
      statement:
        "Studs, fasteners, layers, insulation, joints, penetrations, and perimeter details must match the listed construction where the listing requires them.",
    },
    caution: {
      source: "Applicable listing and acoustic test report",
      statement:
        "A fire-resistance listing is not automatically an acoustic rating, and neither establishes every field flanking path.",
    },
  },
  exampleTopic: "identifier",
  id: "acoustics/listed-assembly-evidence-reference",
  title: "Listed Assembly Evidence Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
