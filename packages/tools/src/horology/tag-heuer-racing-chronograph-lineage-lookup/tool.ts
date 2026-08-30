import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const heritageEntries = {
  autavia: {
    keyDate: "1962",
    statement:
      "TAG Heuer's official history identifies 1962 as the introduction of the Autavia, Heuer's first named chronograph collection.",
  },
  carrera: {
    keyDate: "1963",
    statement:
      "TAG Heuer's official history identifies the 1963 Carrera as the chronograph that captured the romance and danger of racing.",
  },
  leMans: {
    keyDate: "1971",
    statement:
      "TAG Heuer states that Steve McQueen chose the Monaco for the 1971 film Le Mans, cementing its association with endurance-racing imagery.",
  },
  monaco: {
    keyDate: "1969",
    statement:
      "TAG Heuer introduced the Monaco in 1969 among its first automatic chronographs; the square, left-crown model became a signature racing design.",
  },
  scopeCaution: {
    keyDate: "lineage scope",
    statement:
      "A racing aesthetic, name, color, or chronograph function does not prove a documented competition or film history for an individual watch.",
  },
} as const;

export type RacingHeritageFocus = keyof typeof heritageEntries;

export type RacingHeritageLookupInput = {
  readonly heritageFocus: RacingHeritageFocus;
};

export type RacingHeritageLookupOutput = {
  readonly heritageFocus: RacingHeritageFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupTagHeuerRacingHeritage = (
  input: RacingHeritageLookupInput,
): RacingHeritageLookupOutput => {
  const entry = heritageEntries[input.heritageFocus];
  if (entry === undefined)
    simpleError(
      "heritageFocus",
      "Racing chronograph heritage focus is not supported.",
      "unsupported_heritage_focus",
    );
  return {
    heritageFocus: input.heritageFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const racingHeritageExample = {
  input: { heritageFocus: "carrera" },
  output: {
    heritageFocus: "carrera",
    keyDate: "1963",
    verifiedStatement:
      "TAG Heuer's official history identifies the 1963 Carrera as the chronograph that captured the romance and danger of racing.",
  },
} satisfies ToolExample<RacingHeritageLookupInput, RacingHeritageLookupOutput>;

export const racingHeritageTool = createSimpleTool({
  calculate: (input) =>
    lookupTagHeuerRacingHeritage({
      heritageFocus: input.heritageFocus as RacingHeritageFocus,
    }),
  description:
    "Return TAG Heuer's official Autavia, Carrera, Monaco, Le Mans, or individual-attribution caution for its racing-chronograph heritage.",
  id: "horology/tag-heuer-racing-chronograph-lineage-lookup",
  inputs: [
    {
      enum: ["autavia", "carrera", "monaco", "leMans", "scopeCaution"],
      id: "heritageFocus",
      kind: "string",
      label: "TAG Heuer racing-chronograph heritage focus",
    },
  ],
  outputs: [
    {
      id: "heritageFocus",
      kind: "string",
      label: "TAG Heuer racing-chronograph heritage focus",
    },
    { id: "keyDate", kind: "string", label: "Key date or scope" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified racing-heritage statement",
    },
  ],
  title: "TAG Heuer Racing Chronograph Lineage Lookup",
});

export const runRacingHeritage = racingHeritageTool.execute;
export default racingHeritageTool;
