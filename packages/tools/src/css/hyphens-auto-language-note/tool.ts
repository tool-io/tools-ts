import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly hyphensAuto: boolean;
  readonly explicitLanguagePresent: boolean;
  readonly uaDictionarySupported: boolean;
}>;
export type Output = Readonly<{
  readonly autoHyphenationPrerequisitesWitnessed: boolean;
}>;
const inputFields = [
  { id: "hyphensAuto", label: "Hyphens auto", kind: "boolean" },
  {
    id: "explicitLanguagePresent",
    label: "Explicit language present",
    kind: "boolean",
  },
  {
    id: "uaDictionarySupported",
    label: "Ua dictionary supported",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    autoHyphenationPrerequisitesWitnessed:
      input.hyphensAuto &&
      input.explicitLanguagePresent &&
      input.uaDictionarySupported,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hyphensAuto: true,
  explicitLanguagePresent: false,
  uaDictionarySupported: true,
} satisfies Input;
export const exampleOutput = {
  autoHyphenationPrerequisitesWitnessed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/hyphens-auto-language-note",
  title: "hyphens:auto Language Support Note",
  description:
    "Audit independently supplied language/dictionary prerequisites for automatic hyphenation; support does not guarantee particular hyphen opportunities or breaks. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "autoHyphenationPrerequisitesWitnessed",
      label: "Auto hyphenation prerequisites witnessed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      hyphensAuto: value.hyphensAuto as boolean,
      explicitLanguagePresent: value.explicitLanguagePresent as boolean,
      uaDictionarySupported: value.uaDictionarySupported as boolean,
    }),
});
export const run = tool.execute;
export default tool;
