import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{ readonly extentStatement: string }>;
export type Output = Readonly<{
  readonly normalizedLinearFeet: number;
  readonly canonicalExtentStatement: string;
}>;
const inputFields = [
  { id: "extentStatement", label: "Extent statement", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.extentStatement.length > 128)
    simpleError("extent", "Bounded extent statement required.");
  const m =
    /^\s*([0-9]+(?:\.[0-9]+)?)\s+(?:linear feet|linear foot|lin\. ft\.)\s*$/i.exec(
      input.extentStatement,
    );
  if (!m)
    return simpleError(
      "extent",
      "Explicit linear feet statement required; no cubic volume or other unit guess.",
    );
  const v = nonnegative(Number(m[1]), "extent");
  return {
    normalizedLinearFeet: v,
    canonicalExtentStatement: `${v} linear feet`,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  extentStatement: " 12.50 linear feet ",
} satisfies Input;
export const exampleOutput = {
  normalizedLinearFeet: 12.5,
  canonicalExtentStatement: "12.5 linear feet",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/extent-statement-normalizer",
  title: "Extent Statement Normalizer (linear feet format)",
  description:
    "Normalize a strict decimal extent with explicit supported linear-feet labels; no volume-to-length assumption, ambiguous bare numbers or hidden metric conversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedLinearFeet",
      label: "Normalized linear feet",
      kind: "number",
    },
    {
      id: "canonicalExtentStatement",
      label: "Canonical extent statement",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({ extentStatement: value.extentStatement as string }),
});
export const run = tool.execute;
export default tool;
