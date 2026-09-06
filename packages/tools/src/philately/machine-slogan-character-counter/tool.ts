import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch42-shared.js";
export type Input = Readonly<{ readonly observedSlogan: string }>;
export type Output = Readonly<{
  readonly unicodeScalarCount: number;
  readonly utf16UnitCount: number;
}>;
const inputFields = [
  { id: "observedSlogan", label: "Observed slogan", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(
      input.observedSlogan,
    )
  )
    simpleError("slogan", "Well-formed Unicode text required.");
  return {
    unicodeScalarCount: Array.from(input.observedSlogan).length,
    utf16UnitCount: input.observedSlogan.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSlogan: "POST \ud83d\udcee",
} satisfies Input;
export const exampleOutput = {
  unicodeScalarCount: 6,
  utf16UnitCount: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/machine-slogan-character-counter",
  title: "Machine Cancel Slogan Length Character Counter",
  description:
    "Count slogan Unicode scalar values and UTF16 units separately, not grapheme clusters or OCR characters. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "unicodeScalarCount", label: "Unicode scalar count", kind: "number" },
    { id: "utf16UnitCount", label: "Utf16 unit count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ observedSlogan: value.observedSlogan as string }),
});
export const run = tool.execute;
export default tool;
