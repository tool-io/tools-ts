import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly firstDisplayName: string;
  readonly secondDisplayName: string;
  readonly callerEventYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstDisplayName", label: "First display name", kind: "string" },
  { id: "secondDisplayName", label: "Second display name", kind: "string" },
  { id: "callerEventYear", label: "Caller event year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerEventYear, "year", 1, 9999);
  if (
    [input.firstDisplayName, input.secondDisplayName].some(
      (v) => v.length > 64 || !v.replace(/[^A-Za-z0-9]/g, ""),
    )
  )
    simpleError("names", "Bounded names with actualASCIIletters/digits.");
  return {
    conditionalHashtagCandidate:
      "#" +
      input.firstDisplayName.replace(/[^A-Za-z0-9]/g, "") +
      input.secondDisplayName.replace(/[^A-Za-z0-9]/g, "") +
      input.callerEventYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    firstDisplayName: "Ada",
    secondDisplayName: "Ben",
    callerEventYear: 2026,
  },
  output: { result: { conditionalHashtagCandidate: "#AdaBen2026" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-hashtag-generator",
  title: "Wedding Hashtag Generator",
  description:
    "Deterministic bounded ASCIIname hashtag candidate, not unique reservation, platform-validity guarantee or automatic Unicode transliteration. Both sanitized names nonempty.",
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
