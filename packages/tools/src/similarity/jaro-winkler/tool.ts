import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { calculateJaro } from "../jaro/tool.js";

export type JaroWinklerInput = {
  readonly first: string;
  readonly second: string;
};

export type JaroWinklerOutput = {
  readonly commonPrefixLength: number;
  readonly jaroSimilarity: number;
  readonly similarity: number;
};

export const jaroWinklerExample = {
  input: { first: "MARTHA", second: "MARHTA" },
  output: {
    commonPrefixLength: 3,
    jaroSimilarity: 0.9444444444444445,
    similarity: 0.9611111111111111,
  },
} satisfies ToolExample<JaroWinklerInput, JaroWinklerOutput>;

export const calculateJaroWinkler = (
  input: JaroWinklerInput,
): JaroWinklerOutput => {
  const base = calculateJaro(input);
  const first = [...input.first];
  const second = [...input.second];
  let commonPrefixLength = 0;
  while (
    commonPrefixLength < 4 &&
    commonPrefixLength < first.length &&
    commonPrefixLength < second.length &&
    first[commonPrefixLength] === second[commonPrefixLength]
  )
    commonPrefixLength += 1;
  const appliesBonus = base.similarity > 0.7;
  return {
    commonPrefixLength,
    jaroSimilarity: base.similarity,
    similarity: appliesBonus
      ? base.similarity + 0.1 * commonPrefixLength * (1 - base.similarity)
      : base.similarity,
  };
};

export const jaroWinklerTool = createSimpleTool({
  calculate: (input) =>
    calculateJaroWinkler({
      first: input.first as string,
      second: input.second as string,
    }),
  description:
    "Calculate Jaro-Winkler similarity by boosting Jaro similarity with a common-prefix bonus of scale 0.1 per character up to four characters, applied when Jaro similarity exceeds 0.7.",
  id: "similarity/jaro-winkler",
  inputs: [
    { id: "first", kind: "string", label: "First text" },
    { id: "second", kind: "string", label: "Second text" },
  ],
  outputs: [
    {
      format: "probability",
      id: "similarity",
      kind: "number",
      label: "Similarity",
    },
    {
      description: "The underlying unboosted Jaro similarity.",
      id: "jaroSimilarity",
      kind: "number",
      label: "Jaro similarity",
    },
    {
      description:
        "Length of the shared prefix that earned the bonus, up to four.",
      id: "commonPrefixLength",
      kind: "integer",
      label: "Common prefix length",
    },
  ],
  title: "Jaro–Winkler Similarity Calculator",
});

export const runJaroWinkler = jaroWinklerTool.execute;
export default jaroWinklerTool;
