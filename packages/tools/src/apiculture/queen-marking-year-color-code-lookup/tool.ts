import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch40-shared.js";
export type Input = Readonly<{ readonly callerQueenBirthYear: number }>;
export type Output = Readonly<{ readonly standardMarkingColor: string }>;
const inputFields = [
  {
    id: "callerQueenBirthYear",
    label: "Caller queen birth year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerQueenBirthYear, "year", 1, 9999);
  return {
    standardMarkingColor: ["blue", "white", "yellow", "red", "green"][
      input.callerQueenBirthYear % 5
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { callerQueenBirthYear: 2026 } satisfies Input;
export const exampleOutput = { standardMarkingColor: "white" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/queen-marking-year-color-code-lookup",
  title: "Queen Marking Year Color Code Lookup",
  description:
    "Named repeating queen marking convention yearsending1/6 white,2/7 yellow,3/8 red,4/9 green,0/5 blue; no queen age/authenticity inferred from observed paint. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "standardMarkingColor",
      label: "Standard marking color",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({ callerQueenBirthYear: value.callerQueenBirthYear as number }),
});
export const run = tool.execute;
export default tool;
