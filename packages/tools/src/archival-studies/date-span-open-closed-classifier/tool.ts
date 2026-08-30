import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{ readonly yearSpan: string }>;
export type Output = Readonly<{
  readonly spanKind: string;
  readonly knownStartYear: number;
  readonly knownEndYear: number;
}>;
const inputFields = [
  { id: "yearSpan", label: "Year span", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.yearSpan.length || input.yearSpan.length > 32)
    simpleError("span", "Bounded nonempty year span required.");
  const m = /^(\.\.|[1-9][0-9]{3})\/(\.\.|[1-9][0-9]{3})$/.exec(input.yearSpan);
  if (!m)
    return simpleError(
      "span",
      "Exact YYYY/YYYY or .. unknown endpoint syntax required.",
    );
  const a = m[1] === ".." ? -1 : Number(m[1]),
    b = m[2] === ".." ? -1 : Number(m[2]);
  if (a !== -1 && b !== -1 && b < a)
    simpleError("span", "Known endpoint years must be ordered.");
  return {
    spanKind:
      a === -1 && b === -1
        ? "both-open"
        : a === -1
          ? "open-start"
          : b === -1
            ? "open-end"
            : "closed",
    knownStartYear: a,
    knownEndYear: b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { yearSpan: "1900/.." } satisfies Input;
export const exampleOutput = {
  spanKind: "open-end",
  knownStartYear: 1900,
  knownEndYear: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/date-span-open-closed-classifier",
  title: "Date Span Open vs Closed Range Classifier",
  description:
    "Classify explicit known/unknown year endpoints in an archival descriptive range, distinct from ISO interval duration validation; -1 means unknown, not an actual year.",
  inputs: inputFields,
  outputs: [
    { id: "spanKind", label: "Span kind", kind: "string" },
    { id: "knownStartYear", label: "Known start year", kind: "number" },
    { id: "knownEndYear", label: "Known end year", kind: "number" },
  ],
  calculate: (value) => calculate({ yearSpan: value.yearSpan as string }),
});
export const run = tool.execute;
export default tool;
