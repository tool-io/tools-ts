import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerCompoundParts: readonly string[];
  readonly callerLinkingElements: readonly string[];
  readonly callerMaximumCompoundLetters: number;
}>;
export type Output = Readonly<{
  readonly assembledCompound: string;
  readonly componentLetterCounts: readonly number[];
  readonly linkingLetterCount: number;
  readonly totalCompoundCodePoints: number;
  readonly aboveCallerLengthLimit: boolean;
}>;
const inputFields = [
  {
    id: "callerCompoundParts",
    label: "Caller compound parts",
    kind: "stringList",
  },
  {
    id: "callerLinkingElements",
    label: "Caller linking elements",
    kind: "stringList",
  },
  {
    id: "callerMaximumCompoundLetters",
    label: "Caller maximum compound letters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.callerMaximumCompoundLetters, "callerMaximumCompoundLetters");
  if (
    !input.callerCompoundParts.length ||
    input.callerLinkingElements.length !==
      input.callerCompoundParts.length - 1 ||
    input.callerCompoundParts.some(
      (s) => !/^[\p{L}\p{M}]+$(?![\s\S])/u.test(s),
    ) ||
    input.callerLinkingElements.some(
      (s) => !/^[\p{L}\p{M}]*$(?![\s\S])/u.test(s),
    )
  )
    simpleError(
      "parts",
      "Explicit letter components and N−1 caller linking elements required.",
    );
  let compound = "";
  input.callerCompoundParts.forEach(
    (s, i) => (compound += s + (input.callerLinkingElements[i] ?? "")),
  );
  const counts = input.callerCompoundParts.map(
      (s) => [...s.normalize("NFC")].length,
    ),
    links = input.callerLinkingElements.reduce(
      (n, s) => n + [...s.normalize("NFC")].length,
      0,
    ),
    length = [...compound.normalize("NFC")].length;
  return {
    assembledCompound: compound.normalize("NFC"),
    componentLetterCounts: counts,
    linkingLetterCount: links,
    totalCompoundCodePoints: length,
    aboveCallerLengthLimit: length > input.callerMaximumCompoundLetters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCompoundParts: ["Arbeit", "Amt"],
  callerLinkingElements: ["s"],
  callerMaximumCompoundLetters: 12,
} satisfies Input;
export const exampleOutput = {
  assembledCompound: "ArbeitsAmt",
  componentLetterCounts: [6, 3],
  linkingLetterCount: 1,
  totalCompoundCodePoints: 10,
  aboveCallerLengthLimit: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/german-compound-noun-length-estimate",
  title: "German Compound Noun Length Estimate",
  description:
    "Budget actual caller German compound components and explicit linking elements under length policy, using NFC code points and preserving supplied case; no morphological segmentation, grammatical capitalization or dictionary-valid compound invention.",
  inputs: inputFields,
  outputs: [
    { id: "assembledCompound", label: "Assembled compound", kind: "string" },
    {
      id: "componentLetterCounts",
      label: "Component letter counts",
      kind: "numberList",
    },
    { id: "linkingLetterCount", label: "Linking letter count", kind: "number" },
    {
      id: "totalCompoundCodePoints",
      label: "Total compound code points",
      kind: "number",
    },
    {
      id: "aboveCallerLengthLimit",
      label: "Above caller length limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCompoundParts: value.callerCompoundParts as readonly string[],
      callerLinkingElements: value.callerLinkingElements as readonly string[],
      callerMaximumCompoundLetters:
        value.callerMaximumCompoundLetters as number,
    }),
});
export const run = tool.execute;
export default tool;
