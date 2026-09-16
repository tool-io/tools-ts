import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
  records,
  sourceFor,
  indices,
} from "../batch53-shared.js";
import base from "../origami-diagram-symbol/tool.js";
export type Input = Readonly<{
  seed: string;
  count: number;
  withoutReplacement: boolean;
  callerReferenceEdition: string;
  practiceStepsJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  {
    id: "callerReferenceEdition",
    label: "Caller reference edition",
    kind: "string",
  },
  { id: "practiceStepsJson", label: "Practice steps json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.callerReferenceEdition.trim())
    simpleError("edition", "Qualified diagram convention required.");
  const a = records(i.practiceStepsJson);
  for (const r of a)
    if (
      typeof r.task !== "string" ||
      !r.task.trim() ||
      typeof r.symbolAsset !== "string" ||
      !r.symbolAsset.trim() ||
      typeof r.minutes !== "number" ||
      r.minutes <= 0 ||
      Object.keys(r).some(
        (k) => !["task", "symbolAsset", "minutes"].includes(k),
      )
    )
      simpleError(
        "steps",
        "Explicit task, qualified asset and positive minutes.",
      );
  const random = sourceFor(i.seed, context),
    selected = indices(a.length, i, random),
    steps = selected.map((j) => {
      const r = a[j],
        result = base.execute(
          {
            seed: i.seed,
            count: 1,
            withoutReplacement: true,
            callerReferenceEdition: i.callerReferenceEdition,
            callerVerifiedOrigamiAssets: [r.symbolAsset],
          },
          { ...context, random },
        );
      if (!result.ok)
        simpleError("asset", "Existing origami symbol tool rejected asset.");
      return {
        task: r.task,
        minutes: r.minutes,
        symbolEvidence: result.output,
      };
    });
  return {
    selectedStepIndexes: selected,
    steps,
    totalMinutes: sum(steps.map((r) => r.minutes as number)),
    edition: i.callerReferenceEdition,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    seed: "tool.io/batch53",
    count: 1,
    withoutReplacement: true,
    callerReferenceEdition: "caller-qualified-edition",
    practiceStepsJson:
      '[{"task":"recognize a fold","symbolAsset":"valley fold asset","minutes":2}]',
  },
  output: {
    result: {
      selectedStepIndexes: [0],
      steps: [
        {
          task: "recognize a fold",
          minutes: 2,
          symbolEvidence: {
            result: {
              values: ["valley fold asset"],
              selectedEntryIndices: [0],
              repertoireSize: 1,
              callerReferenceEdition: "caller-qualified-edition",
            },
          },
        },
      ],
      totalMinutes: 2,
      edition: "caller-qualified-edition",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/origami-practice-plan",
  title: "Random Origami Practice Plan Generator",
  description:
    "Build a bounded randomized origami practice-step plan from independently captioned tasks and durations, importing the existing origami diagram-symbol sampler for every selected step and sharing one advancing source. Not a folding safety or skill-proficiency guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
