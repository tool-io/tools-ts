import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import {
  validateRandomInput,
  finish,
  corpus,
  bounded,
} from "../batch42-shared.js";
import base from "../../typography/modular-scale-step-size/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateInputsJson: readonly string[];
  readonly typeTokenCount: number;
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
  { id: "typeTokenCount", label: "Type token count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  bounded(input.typeTokenCount, "tokens", 1, 32);
  const drawn = corpus(base, input, context);
  const scales = drawn.result.exercises.map((e) => {
    const step = e.input.step;
    if (typeof step !== "number")
      simpleError("step", "Explicit starting scale step required.");
    const tokens = Array.from({ length: input.typeTokenCount }, (_, i) => {
      const answer = base.execute({ ...e.input, step: step + i });
      if (!answer.ok)
        simpleError("scale", "Imported scale step outside supported domain.");
      return { token: "type-" + i, step: step + i, answer: answer.output };
    });
    return { scenario: e.input, tokens };
  });
  return { result: { ...drawn.result, scales } };
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
    candidateInputsJson: ['{"basePixels": 16, "ratio": 1.25, "step": 2}'],
    typeTokenCount: 3,
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/typography-scale",
  title: "Random Typography Scale Generator",
  description:
    "Build a bounded reproducible typography scale from explicitly supplied candidate scenarios. Every candidate must satisfy imported typography/modular-scale-step-size before selection; answer cards preserve its units, conventions, domain limitations and signed/unknown results. Draws are uniform over caller candidate positions; no replacement means no repeated positions, not necessarily distinct answers. No automatic pedagogical correctness, compliance or physical readiness. Creates type-prefixed ordered token rows using the imported scale at successive integer steps; explicit bounded typeTokenCount. Spacing and typography inventories remain separate operational token namespaces.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
