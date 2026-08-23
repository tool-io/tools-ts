import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JaroInput = {
  readonly first: string;
  readonly second: string;
};

export type JaroOutput = {
  readonly matchingCharacters: number;
  readonly similarity: number;
  readonly transpositions: number;
};

const MAX_LENGTH = 2048;

export const jaroExample = {
  input: { first: "MARTHA", second: "MARHTA" },
  output: {
    matchingCharacters: 6,
    similarity: 0.9444444444444445,
    transpositions: 1,
  },
} satisfies ToolExample<JaroInput, JaroOutput>;

export const calculateJaro = (input: JaroInput): JaroOutput => {
  const first = [...input.first];
  const second = [...input.second];
  if (first.length > MAX_LENGTH)
    return simpleError(
      "first",
      `first must not exceed ${MAX_LENGTH} characters.`,
      "text_too_long",
    );
  if (second.length > MAX_LENGTH)
    return simpleError(
      "second",
      `second must not exceed ${MAX_LENGTH} characters.`,
      "text_too_long",
    );
  if (first.length === 0 && second.length === 0)
    return { matchingCharacters: 0, similarity: 1, transpositions: 0 };
  if (first.length === 0 || second.length === 0)
    return { matchingCharacters: 0, similarity: 0, transpositions: 0 };
  const window = Math.max(
    0,
    Math.floor(Math.max(first.length, second.length) / 2) - 1,
  );
  const firstMatched = new Array<boolean>(first.length).fill(false);
  const secondMatched = new Array<boolean>(second.length).fill(false);
  let matches = 0;
  for (let i = 0; i < first.length; i += 1) {
    const low = Math.max(0, i - window);
    const high = Math.min(i + window + 1, second.length);
    for (let j = low; j < high; j += 1) {
      if (secondMatched[j] || first[i] !== second[j]) continue;
      firstMatched[i] = true;
      secondMatched[j] = true;
      matches += 1;
      break;
    }
  }
  if (matches === 0)
    return { matchingCharacters: 0, similarity: 0, transpositions: 0 };
  let halfTranspositions = 0;
  let cursor = 0;
  for (let i = 0; i < first.length; i += 1) {
    if (!firstMatched[i]) continue;
    while (!secondMatched[cursor]) cursor += 1;
    if (first[i] !== second[cursor]) halfTranspositions += 1;
    cursor += 1;
  }
  const transpositions = halfTranspositions / 2;
  return {
    matchingCharacters: matches,
    similarity:
      (matches / first.length +
        matches / second.length +
        (matches - transpositions) / matches) /
      3,
    transpositions,
  };
};

export const jaroTool = createSimpleTool({
  calculate: (input) =>
    calculateJaro({
      first: input.first as string,
      second: input.second as string,
    }),
  description:
    "Calculate Jaro similarity between two strings from matching characters within a sliding window and their transposition count.",
  id: "similarity/jaro",
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
      description: "Number of characters matched within the window.",
      id: "matchingCharacters",
      kind: "integer",
      label: "Matching characters",
    },
    {
      description: "Half the number of matched characters in differing order.",
      id: "transpositions",
      kind: "number",
      label: "Transpositions",
    },
  ],
  title: "Jaro Similarity Calculator",
});

export const runJaro = jaroTool.execute;
export default jaroTool;
