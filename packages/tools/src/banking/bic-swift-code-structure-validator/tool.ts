import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bic } from "../batch-shared.js";
export type Input = Readonly<{ readonly bicText: string }>;
export type Output = Readonly<{
  readonly institutionCode: string;
  readonly countryCode: string;
  readonly locationCode: string;
  readonly branchCode: string;
}>;
const inputFields = [
  { id: "bicText", label: "Bic text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return bic(input.bicText);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { bicText: "AAAAUS00" } satisfies Input;
export const exampleOutput = {
  institutionCode: "AAAA",
  countryCode: "US",
  locationCode: "00",
  branchCode: "XXX",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/bic-swift-code-structure-validator",
  title: "BIC SWIFT Code Structure Validator",
  description:
    "Parse exact uppercase ISO-style eight/eleven-character BIC structure with omitted branch represented XXX; syntax only, not assignment, real country code, sanctions clearance or reachable SWIFT participant verification.",
  inputs: inputFields,
  outputs: [
    { id: "institutionCode", label: "Institution code", kind: "string" },
    { id: "countryCode", label: "Country code", kind: "string" },
    { id: "locationCode", label: "Location code", kind: "string" },
    { id: "branchCode", label: "Branch code", kind: "string" },
  ],
  calculate: (value) => calculate({ bicText: value.bicText as string }),
});
export const run = tool.execute;
export default tool;
