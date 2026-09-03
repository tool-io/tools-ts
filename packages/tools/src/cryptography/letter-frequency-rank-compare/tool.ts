import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, letters } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly callerExpectedDescendingRank: string;
}>;
export type Output = Readonly<{
  readonly observedDescendingRank: string;
  readonly absoluteRankDistance: number;
}>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  {
    id: "callerExpectedDescendingRank",
    label: "Caller expected descending rank",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  letters(input.text, input.callerExpectedDescendingRank);
  const ref = input.callerExpectedDescendingRank;
  if (
    !ref.length ||
    ref.length > 26 ||
    new Set(ref).size !== ref.length ||
    !/^[A-Z]+$(?![\s\S])/.test(ref)
  )
    simpleError(
      "rank",
      "Distinct uppercase caller expected letter rank required.",
    );
  const observed = [...ref]
    .sort(
      (a, b) =>
        [...input.text].filter((c) => c === b).length -
          [...input.text].filter((c) => c === a).length ||
        a.localeCompare(b, "en"),
    )
    .join("");
  return {
    observedDescendingRank: observed,
    absoluteRankDistance: sum(
      [...observed].map((c, i) => Math.abs(i - ref.indexOf(c))),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABBA",
  callerExpectedDescendingRank: "BA",
} satisfies Input;
export const exampleOutput = {
  observedDescendingRank: "AB",
  absoluteRankDistance: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/letter-frequency-rank-compare",
  title: "Letter Frequency Rank Compare Tool",
  description:
    "Compare actual descending letter-count rank to caller reference; equal counts use ASCII alphabetical order, distance not distribution significance.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDescendingRank",
      label: "Observed descending rank",
      kind: "string",
    },
    {
      id: "absoluteRankDistance",
      label: "Absolute rank distance",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      callerExpectedDescendingRank:
        value.callerExpectedDescendingRank as string,
    }),
});
export const run = tool.execute;
export default tool;
