import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CharterWitnessRankerInput = {
  readonly witnesses: readonly string[];
};

export type CharterWitnessRankerOutput = {
  readonly witnessNames: readonly string[];
  readonly ranks: readonly number[];
  readonly precedenceClasses: readonly string[];
};

const ROYAL_TOKENS = [
  "king",
  "queen",
  "rex",
  "regina",
  "emperor",
  "empress",
  "imperator",
  "imperatrix",
  "prince",
  "princess",
] as const;
const ECCLESIASTICAL_TOKENS = [
  "pope",
  "papa",
  "cardinal",
  "archbishop",
  "archiepiscopus",
  "bishop",
  "episcopus",
  "abbot",
  "abbas",
  "abbess",
  "abbatissa",
  "dean",
  "decanus",
  "archdeacon",
  "prior",
  "prioress",
  "priorissa",
] as const;
const NOBLE_TOKENS = [
  "duke",
  "dux",
  "earl",
  "count",
  "comes",
  "countess",
  "baron",
  "baro",
  "lord",
  "lady",
  "dominus",
  "domina",
] as const;
const KNIGHTLY_TOKENS = [
  "knight",
  "miles",
  "esquire",
  "squire",
  "bachelarius",
] as const;

const classifyWitness = (name: string): string => {
  const tokens = name.toLowerCase().match(/\p{L}+/gu) ?? [];
  const hasAny = (list: readonly string[]): boolean =>
    tokens.some((token) => (list as readonly string[]).includes(token));
  if (hasAny(ROYAL_TOKENS)) return "royal";
  if (hasAny(ECCLESIASTICAL_TOKENS)) return "ecclesiastical";
  if (hasAny(NOBLE_TOKENS)) return "noble";
  if (hasAny(KNIGHTLY_TOKENS)) return "knightly";
  return "unspecified";
};

export const calculateCharterWitnessRanker = (
  input: CharterWitnessRankerInput,
): CharterWitnessRankerOutput => {
  if (!(Array.isArray(input.witnesses) && input.witnesses.length > 0))
    return simpleError(
      "witnesses",
      "Provide at least one witness name in document order.",
      "invalid_witness_list",
    );
  if (
    input.witnesses.some(
      (witness) => typeof witness !== "string" || witness.trim().length === 0,
    )
  )
    return simpleError(
      "witnesses",
      "Each witness must be a non-empty name or title string.",
      "invalid_witness",
    );
  return {
    witnessNames: [...input.witnesses],
    ranks: input.witnesses.map((_, index) => index + 1),
    precedenceClasses: input.witnesses.map(classifyWitness),
  };
};

export const charterWitnessRankerExample = {
  input: {
    witnesses: [
      "Rex Johannes",
      "Stephanus archiepiscopus Cantuariensis",
      "Radulfus comes Cestriae",
      "Willelmus de Braiosa",
      "Henricus miles",
    ],
  },
  output: {
    witnessNames: [
      "Rex Johannes",
      "Stephanus archiepiscopus Cantuariensis",
      "Radulfus comes Cestriae",
      "Willelmus de Braiosa",
      "Henricus miles",
    ],
    ranks: [1, 2, 3, 4, 5],
    precedenceClasses: [
      "royal",
      "ecclesiastical",
      "noble",
      "unspecified",
      "knightly",
    ],
  },
} satisfies ToolExample<CharterWitnessRankerInput, CharterWitnessRankerOutput>;

export const charterWitnessRankerTool = createSimpleTool({
  id: "paleography/charter-witness-ranker",
  title: "Charter Witness Ranker",
  description:
    "Rank charter witnesses by list position and classify each by a stated keyword heuristic on Latin/English title tokens with precedence royal > ecclesiastical > noble > knightly > unspecified.",
  inputs: [
    {
      description: "Witness names in the order they attest in the charter.",
      id: "witnesses",
      kind: "stringList",
      label: "Witnesses",
    },
  ],
  outputs: [
    {
      description: "The witness names, in document order.",
      id: "witnessNames",
      kind: "stringList",
      label: "Names",
    },
    {
      description: "One-based rank of each witness (position in the list).",
      id: "ranks",
      kind: "numberList",
      label: "Ranks",
    },
    {
      description: "Keyword-derived precedence class per witness.",
      id: "precedenceClasses",
      kind: "stringList",
      label: "Precedence classes",
    },
  ],
  calculate: (input) =>
    calculateCharterWitnessRanker({
      witnesses: input.witnesses as readonly string[],
    }),
});

export const runCharterWitnessRanker = charterWitnessRankerTool.execute;
export default charterWitnessRankerTool;
