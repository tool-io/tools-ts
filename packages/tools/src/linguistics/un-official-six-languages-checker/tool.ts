import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly languageIso6391Codes: readonly string[];
}>;
export type Output = Readonly<{
  readonly unOfficialLanguageFlags: readonly number[];
  readonly nonOfficialInputCodes: readonly string[];
}>;
const inputFields = [
  {
    id: "languageIso6391Codes",
    label: "Language iso6391 codes",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.languageIso6391Codes.some((v) => !/^([a-z]{2})$/.test(v)))
    simpleError(
      "codes",
      "Exact lowercaseISO639-1codes, no fuzzy language names.",
    );
  const six = ["ar", "zh", "en", "fr", "ru", "es"];
  return {
    unOfficialLanguageFlags: input.languageIso6391Codes.map((v) =>
      six.includes(v) ? 1 : 0,
    ),
    nonOfficialInputCodes: input.languageIso6391Codes.filter(
      (v) => !six.includes(v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  languageIso6391Codes: ["en", "es", "de"],
} satisfies Input;
export const exampleOutput = {
  unOfficialLanguageFlags: [1, 1, 0],
  nonOfficialInputCodes: ["de"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/un-official-six-languages-checker",
  title: "UN Six Official Languages Checker",
  description:
    "Check named six UN official languages by explicit ISO639-1codes; zh denotes Chinese macro-language, not guarantee every variety is an official interpretation language. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "unOfficialLanguageFlags",
      label: "Un official language flags",
      kind: "numberList",
    },
    {
      id: "nonOfficialInputCodes",
      label: "Non official input codes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      languageIso6391Codes: value.languageIso6391Codes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
