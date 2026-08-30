import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return federal airport-noise compatibility context without replacing the full land-use table or local planning decision.",
  entries: {
    residential: {
      source: "14 CFR Part 150 Appendix A, Table 1",
      statement:
        "Under 14 CFR Part 150 Appendix A, residential use is generally compatible below DNL 65 dB; determinations in higher bands depend on sound attenuation and local conditions.",
    },
    process: {
      source: "FAA Airport Noise Compatibility Planning",
      statement:
        "Part 150 noise exposure maps and compatibility programs are voluntarily prepared by airport sponsors and reviewed by FAA.",
    },
    caution: {
      source: "14 CFR Part 150 Appendix A",
      statement:
        "The federal table does not prevent a local government from adopting different land-use controls, and a contour is not an individual health-risk diagnosis.",
    },
  },
  exampleTopic: "residential",
  id: "acoustics/faa-part-150-land-use-reference",
  title: "FAA Part 150 Land-Use Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
