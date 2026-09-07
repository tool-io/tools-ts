import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  corpus,
  positive,
  simpleError,
} from "../batch42-shared.js";
import base from "../../physics/impulse/tool.js";
import momentum from "../../physics/momentum/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateInputsJson: readonly string[];
  readonly massKg: number;
  readonly initialVelocityMs: number;
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
const fields = [
  ...inputFields,
  { id: "massKg", label: "Same body's mass kg", kind: "number" } as const,
  {
    id: "initialVelocityMs",
    label: "Initial signed velocity m/s",
    kind: "number",
  } as const,
];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  positive(input.massKg, "mass");
  const initial = momentum.execute({
    massKg: input.massKg,
    velocityMs: input.initialVelocityMs,
  });
  if (!initial.ok)
    simpleError("momentum", "Imported initial momentum rejected scenario.");
  const drawn = corpus(base, input, context);
  const exercises = drawn.result.exercises.map((e) => {
    const impulse = (e.answer as { impulseNs: number }).impulseNs;
    const finalMomentum = initial.output.momentumKgMs + impulse;
    const finalVelocity = finalMomentum / input.massKg;
    const final = momentum.execute({
      massKg: input.massKg,
      velocityMs: finalVelocity,
    });
    if (!final.ok)
      simpleError("momentum", "Imported final momentum rejected scenario.");
    return {
      ...e,
      initialMomentum: initial.output,
      finalMomentum: final.output,
      finalSignedVelocityMs: finalVelocity,
    };
  });
  return {
    result: {
      ...drawn.result,
      massKg: input.massKg,
      initialVelocityMs: input.initialVelocityMs,
      exercises,
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, fields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: true,
    candidateInputsJson: ['{"forceN": 8, "deltaTimeS": 2.5}'],
    massKg: 2,
    initialVelocityMs: 3,
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/momentum-impulse-exercise",
  title: "Random Momentum and Impulse Exercise Generator",
  description:
    "Build reproducible constant-force impulse cards and matched initial/final signed momentum for an explicit positive mass and initial velocity, importing both existing calculators. Uniform candidate-position draws; no replacement means distinct positions. One-dimensional constant-mass ideal model only, not collision dynamics, a variable-force integral, automatic pedagogical correctness or physical readiness.",
  inputs: fields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
