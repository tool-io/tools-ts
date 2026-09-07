import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  corpus,
  jsonCases,
  simpleError,
} from "../batch42-shared.js";
import base from "../../physics/kinetic-energy/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateInputsJson: readonly string[];
  readonly comparisonInputJson: string;
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
  {
    id: "comparisonInputJson",
    label: "Comparison kinetic-energy input JSON",
    kind: "string",
  } as const,
];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const comparisonInput = jsonCases([input.comparisonInputJson])[0];
  const comparison = base.execute(comparisonInput);
  if (!comparison.ok)
    simpleError(
      "comparisonInputJson",
      "Imported kinetic energy rejected comparison scenario.",
    );
  const drawn = corpus(base, input, context);
  const exercises = drawn.result.exercises.map((e) => {
    const difference =
      (e.answer as { joules: number }).joules - comparison.output.joules;
    return {
      ...e,
      signedEnergyDifferenceJoules: difference,
      energyComparison:
        difference === 0 ? "equal" : difference > 0 ? "higher" : "lower",
    };
  });
  return {
    result: {
      ...drawn.result,
      comparisonInput,
      comparisonAnswer: comparison.output,
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
    candidateInputsJson: ['{"massKg": 2, "speedMs": 3}'],
    comparisonInputJson: '{"massKg": 1, "speedMs": 4}',
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/energy-comparison-scenario",
  title: "Random Energy Comparison Scenario Generator",
  description:
    "Build reproducible candidate-versus-reference kinetic-energy comparison cards using the existing calculator for both scenarios. Preserve signed joule discrepancies and exact ties. Every candidate must satisfy the imported calculator before uniform position sampling; no replacement means no repeated positions, not necessarily distinct energies. Explicit comparison JSON, mass and speed units follow physics/kinetic-energy. No automatic pedagogical correctness or physical readiness.",
  inputs: fields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
