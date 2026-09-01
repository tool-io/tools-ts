import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, roman } from "../shared.js";
export type Input = Readonly<{ readonly romanChordTokens: readonly string[] }>;
export type Output = Readonly<{
  readonly nashvilleChordTokens: readonly string[];
}>;
const inputFields = [
  { id: "romanChordTokens", label: "Roman chord tokens", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.romanChordTokens.length || input.romanChordTokens.length > 128)
    simpleError("tokens", "1–128 Roman tokens required.");
  return {
    nashvilleChordTokens: input.romanChordTokens.map((token) => {
      const r = roman(token),
        a =
          r.alteration < 0
            ? "b".repeat(-r.alteration)
            : "#".repeat(r.alteration),
        q =
          r.quality === "minor"
            ? "m"
            : r.quality === "dim"
              ? "dim"
              : r.quality === "half-dim"
                ? "ø"
                : r.quality === "aug"
                  ? "+"
                  : "";
      return a + r.degree + q + (r.seventh ? "7" : "");
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  romanChordTokens: ["I", "vi", "bVII", "V7"],
} satisfies Input;
export const exampleOutput = {
  nashvilleChordTokens: ["1", "6m", "b7", "57"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/nashville-number-conversion",
  title: "Nashville Number System Conversion",
  description:
    "Parse literal Roman roots/qualities/sevenths into explicitly concatenated Nashville number suffix convention (V7→57), preserving accidental and minor/diminished evidence; not numeral text replacement or absolute-key assignment.",
  inputs: inputFields,
  outputs: [
    {
      id: "nashvilleChordTokens",
      label: "Nashville chord tokens",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      romanChordTokens: value.romanChordTokens as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
