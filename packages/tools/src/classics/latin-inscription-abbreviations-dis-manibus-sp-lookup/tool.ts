import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly queryAbbreviation: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "queryAbbreviation", label: "Query abbreviation", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return {
    commonExpansion: pick(
      input.queryAbbreviation,
      {
        "D M": "Dis Manibus",
        "D M S": "Dis Manibus sacrum",
        "S P Q R": "Senatus Populusque Romanus",
      },
      "abbreviation",
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { queryAbbreviation: "D M" },
  output: { result: { commonExpansion: "Dis Manibus" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/latin-inscription-abbreviations-dis-manibus-sp-lookup",
  title: "Latin Inscription Abbreviations D M SP Lookup",
  description:
    "Small explicit common Latin inscription abbreviation expansion set, not all SP contexts; exact spaces required and reading/context remain independently verified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { commonExpansion: { type: "string" } },
        required: ["commonExpansion"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
