import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly boardRows: readonly string[];
  readonly candidateWord: string;
  readonly callerMinimumWordLetters: number;
}>;
export type Output = Readonly<{
  readonly lengthMeetsCallerPolicy: boolean;
  readonly foundNonreusingTilePath: boolean;
  readonly validUnderCallerLengthAndPathPolicy: boolean;
  readonly witnessTileIndices: readonly number[];
}>;
const inputFields = [
  { id: "boardRows", label: "Board rows", kind: "stringList" },
  { id: "candidateWord", label: "Candidate word", kind: "string" },
  {
    id: "callerMinimumWordLetters",
    label: "Caller minimum word letters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.callerMinimumWordLetters, "callerMinimumWordLetters");
  if (
    !input.boardRows.length ||
    input.boardRows.length > 5 ||
    input.boardRows[0].length < 1 ||
    input.boardRows[0].length > 5 ||
    input.boardRows.some(
      (r) =>
        r.length !== input.boardRows[0].length || !/^[A-Z]+$(?![\s\S])/.test(r),
    ) ||
    !/^[A-Z]{1,16}$(?![\s\S])/.test(input.candidateWord) ||
    input.callerMinimumWordLetters < 1
  )
    simpleError(
      "board",
      "Rectangular up-to-5×5 A–Z tiles, 1–16-letter word and positive policy minimum required.",
    );
  const w = input.boardRows[0].length,
    h = input.boardRows.length,
    tiles = input.boardRows.flatMap((r) =>
      [...r].map((c) => (c === "Q" ? "QU" : c)),
    );
  let work = 0;
  const search = (
    i: number,
    offset: number,
    path: number[],
  ): number[] | null => {
    if (++work > 200000)
      return simpleError(
        "search",
        "Bounded search budget exhausted; absence cannot be asserted.",
      );
    if (path.includes(i) || !input.candidateWord.startsWith(tiles[i], offset))
      return null;
    const next = offset + tiles[i].length,
      p = [...path, i];
    if (next === input.candidateWord.length) return p;
    const y = Math.floor(i / w),
      x = i % w;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const r = y + dy,
          c = x + dx;
        if ((dy || dx) && r >= 0 && r < h && c >= 0 && c < w) {
          const found = search(r * w + c, next, p);
          if (found) return found;
        }
      }
    return null;
  };
  let witness: number[] = [];
  for (let i = 0; i < tiles.length && !witness.length; i++)
    witness = search(i, 0, []) ?? [];
  const meets = input.candidateWord.length >= input.callerMinimumWordLetters;
  return {
    lengthMeetsCallerPolicy: meets,
    foundNonreusingTilePath: witness.length > 0,
    validUnderCallerLengthAndPathPolicy: meets && witness.length > 0,
    witnessTileIndices: witness,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  boardRows: ["CAT", "DOG", "SUN"],
  candidateWord: "CAT",
  callerMinimumWordLetters: 3,
} satisfies Input;
export const exampleOutput = {
  lengthMeetsCallerPolicy: true,
  foundNonreusingTilePath: true,
  validUnderCallerLengthAndPathPolicy: true,
  witnessTileIndices: [0, 1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/boggle-minimum-word-length-3-checker",
  title: "Boggle Minimum Word Length 3 Check",
  description:
    "Audit actual eight-neighbor nonreusing Boggle tile path separately from caller minimum length; Q tile means QU, dictionary membership is not inferred. Resource exhaustion is an error, never claimed nonexistence.",
  inputs: inputFields,
  outputs: [
    {
      id: "lengthMeetsCallerPolicy",
      label: "Length meets caller policy",
      kind: "boolean",
    },
    {
      id: "foundNonreusingTilePath",
      label: "Found nonreusing tile path",
      kind: "boolean",
    },
    {
      id: "validUnderCallerLengthAndPathPolicy",
      label: "Valid under caller length and path policy",
      kind: "boolean",
    },
    {
      id: "witnessTileIndices",
      label: "Witness tile indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      boardRows: value.boardRows as readonly string[],
      candidateWord: value.candidateWord as string,
      callerMinimumWordLetters: value.callerMinimumWordLetters as number,
    }),
});
export const run = tool.execute;
export default tool;
