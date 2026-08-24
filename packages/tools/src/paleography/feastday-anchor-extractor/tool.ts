import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeastdayAnchorExtractorInput = {
  readonly charterText: string;
};

export type FeastdayAnchorExtractorOutput = {
  readonly anchorName: string;
  readonly fixedDate: string;
  readonly monthBand:
    | "january"
    | "february"
    | "march"
    | "april"
    | "may"
    | "june"
    | "july"
    | "august"
    | "september"
    | "october"
    | "november"
    | "december"
    | "movable";
  readonly matchedAlias: string;
};

type FeastEntry = {
  readonly anchorName: string;
  readonly fixedDate: string;
  readonly monthBand:
    | "january"
    | "february"
    | "march"
    | "april"
    | "may"
    | "june"
    | "july"
    | "august"
    | "september"
    | "october"
    | "november"
    | "december"
    | "movable";
  readonly aliases: readonly string[];
};

const FEASTS: readonly FeastEntry[] = [
  {
    anchorName: "Christmas (Nativity of the Lord)",
    fixedDate: "12-25",
    monthBand: "december",
    aliases: ["natalis domini", "nativitas domini", "christmas"],
  },
  {
    anchorName: "Feast of St Stephen",
    fixedDate: "12-26",
    monthBand: "december",
    aliases: ["sancti stephani", "st stephen", "saint stephen"],
  },
  {
    anchorName: "Feast of St John the Evangelist",
    fixedDate: "12-27",
    monthBand: "december",
    aliases: [
      "johannis evangeliste",
      "joannis evangeliste",
      "john the evangelist",
    ],
  },
  {
    anchorName: "Holy Innocents",
    fixedDate: "12-28",
    monthBand: "december",
    aliases: ["innocentium", "holy innocents"],
  },
  {
    anchorName: "Feast of St Nicholas",
    fixedDate: "12-06",
    monthBand: "december",
    aliases: ["sancti nicolai", "nicholas", "nicholai"],
  },
  {
    anchorName: "Feast of St Lucy",
    fixedDate: "12-13",
    monthBand: "december",
    aliases: ["luciae", "lucie", "st lucy", "saint lucy"],
  },
  {
    anchorName: "Epiphany",
    fixedDate: "01-06",
    monthBand: "january",
    aliases: ["epiphania", "epiphanie", "epiphany", "theophania"],
  },
  {
    anchorName: "Candlemas (Purification of Mary)",
    fixedDate: "02-02",
    monthBand: "february",
    aliases: ["purificatio", "candlemas", "hypapante"],
  },
  {
    anchorName: "Feast of St Valentine",
    fixedDate: "02-14",
    monthBand: "february",
    aliases: ["valentini", "valentine"],
  },
  {
    anchorName: "Annunciation (Lady Day)",
    fixedDate: "03-25",
    monthBand: "march",
    aliases: ["annuntiation", "annunciation", "lady day"],
  },
  {
    anchorName: "Easter",
    fixedDate: "movable",
    monthBand: "movable",
    aliases: ["pascha", "pasche", "easter", "resurrectionis"],
  },
  {
    anchorName: "Ascension",
    fixedDate: "movable",
    monthBand: "movable",
    aliases: ["ascensio", "ascension"],
  },
  {
    anchorName: "Pentecost",
    fixedDate: "movable",
    monthBand: "movable",
    aliases: ["pentecost", "whitsun"],
  },
  {
    anchorName: "Nativity of St John the Baptist",
    fixedDate: "06-24",
    monthBand: "june",
    aliases: ["johannis baptiste", "joannis baptiste", "john the baptist"],
  },
  {
    anchorName: "Feasts of SS Peter and Paul",
    fixedDate: "06-29",
    monthBand: "june",
    aliases: ["petri et pauli", "peter and paul"],
  },
  {
    anchorName: "Feast of St Barnabas",
    fixedDate: "06-11",
    monthBand: "june",
    aliases: ["barnabe", "barnabas"],
  },
  {
    anchorName: "Feast of St Mary Magdalene",
    fixedDate: "07-22",
    monthBand: "july",
    aliases: ["magdalene", "magdalena"],
  },
  {
    anchorName: "Feast of St James the Greater",
    fixedDate: "07-25",
    monthBand: "july",
    aliases: ["jacobi", "iacobi", "st james"],
  },
  {
    anchorName: "Feast of St Lawrence",
    fixedDate: "08-10",
    monthBand: "august",
    aliases: ["laurentii", "lawrence", "laurence"],
  },
  {
    anchorName: "Assumption of Mary",
    fixedDate: "08-15",
    monthBand: "august",
    aliases: ["assumptio", "assumption"],
  },
  {
    anchorName: "Feast of St Bartholomew",
    fixedDate: "08-24",
    monthBand: "august",
    aliases: ["bartholomei", "bartholomew"],
  },
  {
    anchorName: "Nativity of Mary",
    fixedDate: "09-08",
    monthBand: "september",
    aliases: ["nativitas beate marie", "nativity of our lady"],
  },
  {
    anchorName: "Feast of St Matthew",
    fixedDate: "09-21",
    monthBand: "september",
    aliases: ["matthei", "matthew"],
  },
  {
    anchorName: "Michaelmas",
    fixedDate: "09-29",
    monthBand: "september",
    aliases: ["sancti michaelis", "michaelis", "michaelmas", "sancti angeli"],
  },
  {
    anchorName: "Feast of St Remigius",
    fixedDate: "10-01",
    monthBand: "october",
    aliases: ["remigii", "remigius"],
  },
  {
    anchorName: "Feast of St Denis",
    fixedDate: "10-09",
    monthBand: "october",
    aliases: ["dionisii", "dionysii", "denis"],
  },
  {
    anchorName: "Feast of St Edward the Confessor",
    fixedDate: "10-13",
    monthBand: "october",
    aliases: ["edwardi confessoris", "edward the confessor"],
  },
  {
    anchorName: "Feast of St Luke",
    fixedDate: "10-18",
    monthBand: "october",
    aliases: ["lucae evangeliste", "luke the evangelist"],
  },
  {
    anchorName: "Feast of St Crispin",
    fixedDate: "10-25",
    monthBand: "october",
    aliases: ["crispini", "crispin"],
  },
  {
    anchorName: "Feast of SS Simon and Jude",
    fixedDate: "10-28",
    monthBand: "october",
    aliases: ["simonis et iude", "simon and jude"],
  },
  {
    anchorName: "All Saints",
    fixedDate: "11-01",
    monthBand: "november",
    aliases: ["omnium sanctorum", "all saints", "allsaints"],
  },
  {
    anchorName: "Martinmas",
    fixedDate: "11-11",
    monthBand: "november",
    aliases: [
      "sancti martini",
      "martinmas",
      "martini",
      "saint martin",
      "st martin",
    ],
  },
  {
    anchorName: "Feast of St Andrew",
    fixedDate: "11-30",
    monthBand: "november",
    aliases: ["andree apostoli", "andrew", "andreae"],
  },
  {
    anchorName: "Feast of St Thomas the Apostle",
    fixedDate: "12-21",
    monthBand: "december",
    aliases: ["thome apostoli", "thomas the apostle", "thomae"],
  },
  {
    anchorName: "Feast of St George",
    fixedDate: "04-23",
    monthBand: "april",
    aliases: ["georgii", "george"],
  },
  {
    anchorName: "Feast of St Mark",
    fixedDate: "04-25",
    monthBand: "april",
    aliases: ["marci evangeliste", "mark the evangelist"],
  },
];

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const aliasIndex = (text: string, alias: string): number =>
  new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(alias)}(?![\\p{L}\\p{N}])`,
    "iu",
  ).exec(text)?.index ?? -1;

export const calculateFeastdayAnchorExtractor = (
  input: FeastdayAnchorExtractorInput,
): FeastdayAnchorExtractorOutput => {
  if (input.charterText.trim().length === 0)
    return simpleError(
      "charterText",
      "Provide the charter text to search.",
      "invalid_text",
    );
  let bestIndex = Number.POSITIVE_INFINITY;
  let bestEntry: FeastEntry | undefined;
  let bestAlias = "";
  for (const entry of FEASTS)
    for (const alias of entry.aliases) {
      const index = aliasIndex(input.charterText, alias);
      if (index !== -1 && index < bestIndex) {
        bestIndex = index;
        bestEntry = entry;
        bestAlias = alias;
      }
    }
  if (!bestEntry)
    return simpleError(
      "charterText",
      "No recognised feast-day dating anchor found in the text.",
      "anchor_not_found",
    );
  return {
    anchorName: bestEntry.anchorName,
    fixedDate: bestEntry.fixedDate,
    monthBand: bestEntry.monthBand,
    matchedAlias: bestAlias,
  };
};

export const feastdayAnchorExtractorExample = {
  input: {
    charterText: "Data apud Eboracum die sancti Martini, anno gracie MCXXVII.",
  },
  output: {
    anchorName: "Martinmas",
    fixedDate: "11-11",
    monthBand: "november",
    matchedAlias: "sancti martini",
  },
} satisfies ToolExample<
  FeastdayAnchorExtractorInput,
  FeastdayAnchorExtractorOutput
>;

export const feastdayAnchorExtractorTool = createSimpleTool({
  id: "paleography/feastday-anchor-extractor",
  title: "Feastday Anchor Extractor",
  description:
    "Extract the feast-day dating anchor from a charter by substring heuristic against a documented table of common sanctorale feasts with their fixed liturgical dates (or movable status), returning the earliest match in the text.",
  inputs: [
    {
      description: "Charter transcription to search.",
      id: "charterText",
      kind: "string",
      label: "Charter text",
    },
  ],
  outputs: [
    {
      description: "Canonical name of the detected feast.",
      id: "anchorName",
      kind: "string",
      label: "Anchor feast",
    },
    {
      description: "Fixed date MM-DD or 'movable'.",
      id: "fixedDate",
      kind: "string",
      label: "Fixed date",
    },
    {
      description: "Calendar month band of the feast.",
      id: "monthBand",
      enum: [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
        "movable",
      ],
      kind: "string",
      label: "Month band",
    },
    {
      description: "Alias actually matched in the text.",
      id: "matchedAlias",
      kind: "string",
      label: "Matched alias",
    },
  ],
  calculate: (input) =>
    calculateFeastdayAnchorExtractor({
      charterText: input.charterText as string,
    }),
});

export const runFeastdayAnchorExtractor = feastdayAnchorExtractorTool.execute;
export default feastdayAnchorExtractorTool;
