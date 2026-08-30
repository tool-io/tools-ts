import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return an evidence hierarchy for attributing an ancient Greek coin to a city or mint.",
  entries: {
    legend: {
      source: "American Numismatic Society and major museum catalog practice",
      statement:
        "Read the complete ethnic or civic legend in its original script and position; a partial letter match is not a mint attribution by itself.",
    },
    type: {
      source: "Sylloge Nummorum Graecorum and museum catalogues",
      statement:
        "Compare obverse and reverse type, denomination, weight standard, fabric, style, control marks, and die links with a cited catalogue.",
    },
    caution: {
      source: "Ancient Greek numismatic catalog practice",
      statement:
        "Modern borders do not define ancient mints, and uncertain, imitative, and traveling-mint issues should retain qualified attribution.",
    },
  },
  exampleTopic: "legend",
  id: "numismatics/greek-mint-attribution-reference",
  title: "Greek Mint Attribution Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
