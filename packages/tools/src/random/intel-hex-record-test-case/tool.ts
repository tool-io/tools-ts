import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import { validateRandomInput, finish, corpus } from "../batch42-shared.js";
import base from "../../microcontroller/intel-hex-generate/tool.js";
import decoder from "../../microcontroller/intel-hex-parse/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateInputsJson: readonly string[];
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
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const drawn = corpus(base, input, context);
  const exercises = drawn.result.exercises.map((e) => {
    const decoded = decoder.execute({
      line: (e.answer as { line: string }).line,
    });
    if (!decoded.ok)
      simpleError("roundTrip", "Imported decoder rejected the generated case.");
    return { ...e, roundTripAnswer: decoded.output };
  });
  return { result: { ...drawn.result, decoderId: decoder.id, exercises } };
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
    candidateInputsJson: ['{"recordType": 0, "address": 0, "data": [1, 2, 3]}'],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/intel-hex-record-test-case",
  title: "Random Intel HEX Record Test Case Generator",
  description:
    "Build a bounded reproducible intel hex record test case from explicitly supplied candidate scenarios. Every candidate must satisfy imported microcontroller/intel-hex-generate before selection; answer cards preserve its units, conventions, domain limitations and signed/unknown results. Draws are uniform over caller candidate positions; no replacement means no repeated positions, not necessarily distinct answers. No automatic pedagogical correctness, compliance or physical readiness. Also imports microcontroller/intel-hex-parse and returns actual round-trip answers; decoding errors propagate, rather than asserting success from generation alone.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
