import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TriaNominaAnalyzerInput = {
  readonly name: string;
};

export type TriaNominaAnalyzerOutput = {
  readonly hasPraenomen: boolean;
  readonly hasNomen: boolean;
  readonly hasCognomen: boolean;
  readonly completenessScore: number;
  readonly isComplete: boolean;
};

const PRAENOMEN_TOKENS = new Set([
  "a",
  "c",
  "d",
  "g",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "s",
  "t",
  "v",
  "app",
  "cn",
  "mam",
  "ser",
  "sex",
  "sp",
  "st",
  "ti",
  "vol",
  "vop",
  "appius",
  "aulus",
  "decimus",
  "gaius",
  "gnaeus",
  "kaeso",
  "lucius",
  "mamercus",
  "manius",
  "numerius",
  "publius",
  "quintus",
  "servius",
  "sextus",
  "spurius",
  "titus",
  "tiberius",
  "vopiscus",
]);
const NOMEN_SUFFIX = /(?:ius|ia|eus|ea)\.?$/i;

export const calculateTriaNominaAnalyzer = (
  input: TriaNominaAnalyzerInput,
): TriaNominaAnalyzerOutput => {
  if (!input.name.trim())
    simpleError("name", "Name must contain characters.", "empty_name");
  const tokens = input.name.trim().split(/\s+/);
  const firstToken = tokens[0].replace(/\.+$/, "").toLowerCase();
  const hasPraenomen = PRAENOMEN_TOKENS.has(firstToken);
  const rest = tokens.slice(hasPraenomen ? 1 : 0);
  const nomenIndex = rest.findIndex((token) => NOMEN_SUFFIX.test(token));
  const hasNomen = nomenIndex !== -1;
  const afterNomen = hasNomen
    ? [...rest.slice(0, nomenIndex), ...rest.slice(nomenIndex + 1)]
    : rest;
  const hasCognomen = afterNomen.length > 0;
  const completenessScore =
    (hasPraenomen ? 1 : 0) + (hasNomen ? 1 : 0) + (hasCognomen ? 1 : 0);
  return {
    hasPraenomen,
    hasNomen,
    hasCognomen,
    completenessScore,
    isComplete: completenessScore === 3,
  };
};

export const triaNominaAnalyzerExample = {
  input: { name: "M. Tullius Cicero" },
  output: {
    hasPraenomen: true,
    hasNomen: true,
    hasCognomen: true,
    completenessScore: 3,
    isComplete: true,
  },
} satisfies ToolExample<TriaNominaAnalyzerInput, TriaNominaAnalyzerOutput>;

export const triaNominaAnalyzerTool = createSimpleTool({
  id: "epigraphy/tria-nomina-analyzer",
  title: "Tria Nomina Completeness Structure Analyzer",
  description:
    "Analyzes whether a Roman name supplies the full tria nomina using standard praenomen tokens and gentilicial -ius/-eus/-ia/-ea nomen endings.",
  inputs: [
    {
      id: "name",
      kind: "string",
      label: "Name",
      description: "Roman name to analyze.",
    },
  ],
  outputs: [
    {
      id: "hasPraenomen",
      kind: "boolean",
      label: "Has praenomen",
      description: "First token is a known praenomen or abbreviation.",
    },
    {
      id: "hasNomen",
      kind: "boolean",
      label: "Has nomen",
      description: "A later token ends with a gentilicial suffix.",
    },
    {
      id: "hasCognomen",
      kind: "boolean",
      label: "Has cognomen",
      description: "At least one element remains beyond praenomen and nomen.",
    },
    {
      id: "completenessScore",
      kind: "integer",
      label: "Score",
      description: "Count of tria nomina slots present, zero to three.",
    },
    {
      id: "isComplete",
      kind: "boolean",
      label: "Complete",
      description: "All three onomastic slots are present.",
    },
  ],
  calculate: (input) =>
    calculateTriaNominaAnalyzer(input as unknown as TriaNominaAnalyzerInput),
});

export const runTriaNominaAnalyzer = triaNominaAnalyzerTool.execute;
export default triaNominaAnalyzerTool;
