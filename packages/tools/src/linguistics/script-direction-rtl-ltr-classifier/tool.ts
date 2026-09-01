import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, textBound } from "../batch-shared.js";
export type Input = Readonly<{ readonly observedText: string }>;
export type Output = Readonly<{
  readonly firstObservedStrongDirection: string;
  readonly leftToRightLetterCount: number;
  readonly rightToLeftLetterCount: number;
  readonly otherUnclassifiedLetterCount: number;
  readonly mixedDirectionLettersObserved: boolean;
}>;
const inputFields = [
  { id: "observedText", label: "Observed text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  textBound(input.observedText);
  let l = 0,
    r = 0,
    u = 0,
    first = "none";
  for (const c of input.observedText) {
    if (!/\p{L}/u.test(c)) continue;
    const rtl =
        /[\p{Script=Hebrew}\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Nko}\p{Script=Adlam}]/u.test(
          c,
        ),
      ltr =
        /[\p{Script=Latin}\p{Script=Greek}\p{Script=Cyrillic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Devanagari}\p{Script=Thai}]/u.test(
          c,
        );
    if (rtl) {
      r++;
      if (first === "none") first = "rtl";
    } else if (ltr) {
      l++;
      if (first === "none") first = "ltr";
    } else u++;
  }
  return {
    firstObservedStrongDirection: first,
    leftToRightLetterCount: l,
    rightToLeftLetterCount: r,
    otherUnclassifiedLetterCount: u,
    mixedDirectionLettersObserved: l > 0 && r > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { observedText: "Hello אב" } satisfies Input;
export const exampleOutput = {
  firstObservedStrongDirection: "ltr",
  leftToRightLetterCount: 5,
  rightToLeftLetterCount: 2,
  otherUnclassifiedLetterCount: 0,
  mixedDirectionLettersObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/script-direction-rtl-ltr-classifier",
  title: "RTL/LTR Script Direction Classifier",
  description:
    "Audit letters in an explicitly bounded selected-script subset for common RTL/LTR direction and first classified letter; other scripts remain unclassified. Not Unicode bidi-class/UAX#9 layout, spoof detection or inferred language.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstObservedStrongDirection",
      label: "First observed strong direction",
      kind: "string",
    },
    {
      id: "leftToRightLetterCount",
      label: "Left to right letter count",
      kind: "number",
    },
    {
      id: "rightToLeftLetterCount",
      label: "Right to left letter count",
      kind: "number",
    },
    {
      id: "otherUnclassifiedLetterCount",
      label: "Other unclassified letter count",
      kind: "number",
    },
    {
      id: "mixedDirectionLettersObserved",
      label: "Mixed direction letters observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ observedText: value.observedText as string }),
});
export const run = tool.execute;
export default tool;
