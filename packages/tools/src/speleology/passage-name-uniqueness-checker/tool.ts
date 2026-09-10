import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualExistingPassageNames: readonly string[];
  readonly proposedPassageName: string;
  readonly proposedSectionPrefix: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualExistingPassageNames",
    label: "Actual existing passage names",
    kind: "stringList",
  },
  { id: "proposedPassageName", label: "Proposed passage name", kind: "string" },
  {
    id: "proposedSectionPrefix",
    label: "Proposed section prefix",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.actualExistingPassageNames, "names");
  if (
    !input.proposedPassageName.trim() ||
    !input.proposedSectionPrefix.trim() ||
    /[\/]/.test(input.proposedPassageName + input.proposedSectionPrefix)
  )
    simpleError("name", "Nonblank bounded slash-free actual names/prefix.");
  return {
    normalizedCandidateIdentity:
      input.proposedSectionPrefix.trim() +
      "/" +
      input.proposedPassageName.trim(),
    exactNameAlreadyPresent: input.actualExistingPassageNames.includes(
      input.proposedPassageName.trim(),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualExistingPassageNames: ["North", "South"],
    proposedPassageName: "West",
    proposedSectionPrefix: "CaveA",
  },
  output: {
    result: {
      normalizedCandidateIdentity: "CaveA/West",
      exactNameAlreadyPresent: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/passage-name-uniqueness-checker",
  title: "Passage Name Uniqueness Prefix Checker",
  description:
    "Exact case-sensitive passage-name collision versus actual inventory with explicit section prefix. Does not reserve identity, infer fuzzy equivalence or validate nomenclature authority.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
