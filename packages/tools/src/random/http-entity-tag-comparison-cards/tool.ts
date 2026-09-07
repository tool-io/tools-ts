import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import { validateRandomInput, finish, corpus } from "../batch42-shared.js";
import base from "../../http/etag-parser/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateInputsJson: readonly string[];
  readonly comparisonEtag: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  {
    id: "candidateInputsJson",
    label: "Candidate inputs json",
    kind: "stringList",
  },
  { id: "comparisonEtag", label: "Comparison etag", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const other = base.execute({ etag: input.comparisonEtag });
  if (!other.ok)
    simpleError(
      "comparisonEtag",
      "Strict independently provided comparison entity tag required.",
    );
  const drawn = corpus(base, input, context);
  const exercises = drawn.result.exercises.map((e) => {
    const tag = e.answer as { weak: boolean; opaqueValue: string };
    return {
      ...e,
      comparisonTag: input.comparisonEtag,
      weaklyEqual: tag.opaqueValue === other.output.opaqueValue,
      stronglyEqual:
        !tag.weak &&
        !other.output.weak &&
        tag.opaqueValue === other.output.opaqueValue,
    };
  });
  return { result: { ...drawn.result, exercises } };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: true,
    candidateInputsJson: ['{"etag": "W/\\"revision-7\\""}'],
    comparisonEtag: '"revision-7"',
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/http-entity-tag-comparison-cards",
  title: "Random HTTP Entity Tag Comparison Cards Generator",
  description:
    "Build a bounded reproducible http entity tag comparison cards from explicitly supplied candidate scenarios. Every candidate must satisfy imported http/etag-parser before selection; answer cards preserve its units, conventions, domain limitations and signed/unknown results. Draws are uniform over caller candidate positions; no replacement means no repeated positions, not necessarily distinct answers. No automatic pedagogical correctness, compliance or physical readiness. Compares each parsed candidate with explicit second entity tag: weak equality requires opaque equality, strong equality also requires neither tag weak; not precondition evaluation or cache freshness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
