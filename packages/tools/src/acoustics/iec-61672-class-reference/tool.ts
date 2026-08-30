import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the practical distinction and limitations of Class 1 and Class 2 sound-level meters.",
  entries: {
    "class-1": {
      source: "IEC 61672-1",
      statement:
        "IEC 61672 Class 1 instruments have tighter tolerance limits and a wider specified frequency range than Class 2 instruments.",
    },
    "class-2": {
      source: "IEC 61672-1",
      statement:
        "Class 2 instruments support general-purpose measurements where the governing method permits their wider tolerances.",
    },
    caution: {
      source: "IEC 61672 series",
      statement:
        "There is no single tolerance number valid at every frequency and level; compliance requires the standard’s complete tests and the measurement method’s class requirement.",
    },
  },
  exampleTopic: "class-1",
  id: "acoustics/iec-61672-class-reference",
  title: "IEC 61672 Class Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
