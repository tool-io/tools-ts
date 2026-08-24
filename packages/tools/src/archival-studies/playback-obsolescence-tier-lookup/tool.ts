import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlaybackObsolescenceTierLookupInput = {
  readonly format:
    | "open-reel-audio"
    | "microcassette"
    | "dat"
    | "laserdisc"
    | "betamax"
    | "umatic"
    | "vhs"
    | "video8-hi8"
    | "minidv-dvcam"
    | "minidisc"
    | "hddvd"
    | "wax-cylinder";
};

export type PlaybackObsolescenceTierLookupOutput = {
  readonly tierScore: number;
  readonly riskTier: "low" | "moderate" | "elevated" | "high" | "critical";
};

const TIER_SCORES: Record<
  PlaybackObsolescenceTierLookupInput["format"],
  number
> = {
  "open-reel-audio": 4,
  microcassette: 4,
  dat: 4,
  laserdisc: 4,
  betamax: 4,
  umatic: 5,
  vhs: 2,
  "video8-hi8": 3,
  "minidv-dvcam": 3,
  minidisc: 3,
  hddvd: 5,
  "wax-cylinder": 5,
};

const TIER_LABELS = [
  "low",
  "moderate",
  "elevated",
  "high",
  "critical",
] as const;

export const calculatePlaybackObsolescenceTierLookup = (
  input: PlaybackObsolescenceTierLookupInput,
): PlaybackObsolescenceTierLookupOutput => {
  const score = TIER_SCORES[input.format];
  if (score === undefined)
    simpleError(
      "format",
      "Format is not part of the obsolescence lookup table.",
      "unknown_format",
    );
  return { tierScore: score, riskTier: TIER_LABELS[score - 1] };
};

export const playbackObsolescenceTierLookupExample = {
  input: { format: "umatic" },
  output: { tierScore: 5, riskTier: "critical" },
} satisfies ToolExample<
  PlaybackObsolescenceTierLookupInput,
  PlaybackObsolescenceTierLookupOutput
>;

export const playbackObsolescenceTierLookupTool = createSimpleTool({
  id: "archival-studies/playback-obsolescence-tier-lookup",
  title: "Playback Obsolescence Tier Lookup",
  description:
    "Classify legacy audiovisual carrier formats into a five-step playback equipment obsolescence risk tier; published guidance varies, so tiers are a heuristic lookup.",
  inputs: [
    {
      description:
        "Legacy audiovisual carrier format to classify for equipment obsolescence risk.",
      enum: [
        "open-reel-audio",
        "microcassette",
        "dat",
        "laserdisc",
        "betamax",
        "umatic",
        "vhs",
        "video8-hi8",
        "minidv-dvcam",
        "minidisc",
        "hddvd",
        "wax-cylinder",
      ],
      id: "format",
      kind: "string",
      label: "Format",
    },
  ],
  outputs: [
    {
      description:
        "Numeric obsolescence risk tier from 1 (low) to 5 (critical).",
      id: "tierScore",
      kind: "integer",
      label: "Tier score",
    },
    {
      description: "Named playback equipment obsolescence risk tier.",
      enum: ["low", "moderate", "elevated", "high", "critical"],
      id: "riskTier",
      kind: "string",
      label: "Risk tier",
    },
  ],
  calculate: (input) =>
    calculatePlaybackObsolescenceTierLookup({
      format: input.format as PlaybackObsolescenceTierLookupInput["format"],
    }),
});

export const runPlaybackObsolescenceTierLookup =
  playbackObsolescenceTierLookupTool.execute;
export default playbackObsolescenceTierLookupTool;
