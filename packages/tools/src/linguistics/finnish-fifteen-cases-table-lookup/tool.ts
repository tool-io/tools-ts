import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly finnishCase: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "finnishCase", label: "Finnish case", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.finnishCase,
      {
        nominative: "subject/default citation",
        genitive: "possessive and other genitive constructions",
        accusative:
          "total object functions with form distribution context-dependent",
        partitive: "partial object and quantity uses",
        inessive: "internal location",
        elative: "movement from inside",
        illative: "movement into",
        adessive: "external location",
        ablative: "movement from outside/on",
        allative: "movement onto/to external location",
        essive: "state or role",
        translative: "change to state or role",
        instructive: "means/manner in restricted uses",
        abessive: "absence/without",
        comitative: "accompaniment in restricted constructions",
      },
      "finnishCase",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { finnishCase: "partitive" } satisfies Input;
export const exampleOutput = {
  meaning: "partial object and quantity uses",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/finnish-fifteen-cases-table-lookup",
  title: "Finnish 15-Case Table Lookup",
  description:
    "Supported traditional15Finnish case-label descriptors, not suffix generation or uniform accusative paradigm. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ finnishCase: value.finnishCase as string }),
});
export const run = tool.execute;
export default tool;
