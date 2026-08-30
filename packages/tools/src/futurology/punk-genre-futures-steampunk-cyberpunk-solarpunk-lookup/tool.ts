import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const genres = {
  cyberpunk: {
    blindSpot:
      "Ecosystem harm, repair, and governance may remain outside the frame.",
    designCues: [
      "dense infrastructure",
      "corporate power",
      "street-level adaptation",
    ],
    lens: "How do powerful technical systems reshape inequality and urban life?",
  },
  dieselpunk: {
    blindSpot:
      "Romanticized machinery can obscure labor, extraction, and accessibility costs.",
    designCues: [
      "interwar aesthetics",
      "analogue machinery",
      "parallel institutions",
    ],
    lens: "How might durable technology and alternate institutions coexist with modern systems?",
  },
  solarpunk: {
    blindSpot:
      "Utopian imagery can hide conflict, labor, and implementation trade-offs.",
    designCues: [
      "living systems",
      "cooperative institutions",
      "regenerative design",
    ],
    lens: "How might ecological repair and community governance be made desirable and feasible?",
  },
  steampunk: {
    blindSpot:
      "Aesthetic nostalgia can romanticize extraction, empire, and unequal access.",
    designCues: [
      "steam technology",
      "craft guilds",
      "portable but uneven systems",
    ],
    lens: "How might materially different technologies reorganize work, identity, and power?",
  },
} as const;

export type PunkFuturesGenre = keyof typeof genres;

export type PunkFuturesInput = {
  readonly genre: PunkFuturesGenre;
};

export type PunkFuturesOutput = {
  readonly blindSpot: string;
  readonly designCues: ReadonlyArray<string>;
  readonly futuresLens: string;
  readonly genre: PunkFuturesGenre;
};

export const lookupPunkFuturesGenre = (
  input: PunkFuturesInput,
): PunkFuturesOutput => {
  const genre = genres[input.genre];
  if (genre === undefined)
    simpleError(
      "genre",
      "Punk futures genre is not supported.",
      "unsupported_punk_genre",
    );
  return {
    blindSpot: genre.blindSpot,
    designCues: [...genre.designCues],
    futuresLens: genre.lens,
    genre: input.genre,
  };
};

export const punkFuturesExample = {
  input: { genre: "solarpunk" },
  output: {
    blindSpot:
      "Utopian imagery can hide conflict, labor, and implementation trade-offs.",
    designCues: [
      "living systems",
      "cooperative institutions",
      "regenerative design",
    ],
    futuresLens:
      "How might ecological repair and community governance be made desirable and feasible?",
    genre: "solarpunk",
  },
} satisfies ToolExample<PunkFuturesInput, PunkFuturesOutput>;

export const punkFuturesTool = createSimpleTool({
  calculate: (input) =>
    lookupPunkFuturesGenre({ genre: input.genre as PunkFuturesGenre }),
  description:
    "Return a futures lens, design cues, and blind spot for a caller-selected punk-futures genre.",
  id: "futurology/punk-genre-futures-steampunk-cyberpunk-solarpunk-lookup",
  inputs: [
    {
      enum: ["steampunk", "dieselpunk", "cyberpunk", "solarpunk"],
      id: "genre",
      kind: "string",
      label: "Punk futures genre",
    },
  ],
  outputs: [
    { id: "blindSpot", kind: "string", label: "Genre blind spot" },
    { id: "designCues", kind: "stringList", label: "Design cues" },
    { id: "futuresLens", kind: "string", label: "Futures lens" },
    { id: "genre", kind: "string", label: "Punk futures genre" },
  ],
  title: "Punk Genre Futures Steampunk Cyberpunk Solarpunk Lookup",
});

export const runPunkFutures = punkFuturesTool.execute;
export default punkFuturesTool;
