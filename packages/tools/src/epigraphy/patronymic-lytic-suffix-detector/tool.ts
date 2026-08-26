import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PatronymicLyticSuffixDetectorInput = {
  readonly name: string;
};

export type PatronymicLyticSuffixDetectorOutput = {
  readonly hasPatronymicSuffix: boolean;
  readonly matchedSuffix: string;
};

const SUFFIXES = ["iades", "ides", "idas"] as const;

export const calculatePatronymicLyticSuffixDetector = (
  input: PatronymicLyticSuffixDetectorInput,
): PatronymicLyticSuffixDetectorOutput => {
  const name = input.name.trim();
  if (!name)
    return simpleError(
      "name",
      "The name must be a non-empty string.",
      "empty_name",
    );
  const lowered = name.toLowerCase();
  for (const suffix of SUFFIXES)
    if (lowered.endsWith(suffix) && lowered.length >= suffix.length + 2)
      return { hasPatronymicSuffix: true, matchedSuffix: suffix };
  return { hasPatronymicSuffix: false, matchedSuffix: "" };
};

export const patronymicLyticSuffixDetectorExample = {
  input: { name: "Aristeides" },
  output: { hasPatronymicSuffix: true, matchedSuffix: "ides" },
} satisfies ToolExample<
  PatronymicLyticSuffixDetectorInput,
  PatronymicLyticSuffixDetectorOutput
>;

export const patronymicLyticSuffixDetectorTool = createSimpleTool({
  id: "epigraphy/patronymic-lytic-suffix-detector",
  title: "Patronymic Lytic Suffix Greek Detector",
  description:
    "Flag Latinized Greek patronymic adjective endings (-iades, -ides, -idas checked in that order, requiring at least two letters before the suffix) on a personal name.",
  inputs: [
    {
      description: "Latinized Greek personal name.",
      id: "name",
      kind: "string",
      label: "Name",
    },
  ],
  outputs: [
    {
      description: "True when a patronymic suffix was found.",
      id: "hasPatronymicSuffix",
      kind: "boolean",
      label: "Patronymic",
    },
    {
      description: "Matched suffix, or empty string.",
      id: "matchedSuffix",
      kind: "string",
      label: "Matched suffix",
    },
  ],
  calculate: (input) =>
    calculatePatronymicLyticSuffixDetector(
      input as unknown as PatronymicLyticSuffixDetectorInput,
    ),
});

export const runPatronymicLyticSuffixDetector =
  patronymicLyticSuffixDetectorTool.execute;
export default patronymicLyticSuffixDetectorTool;
