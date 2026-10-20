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
export type Output = ReturnType<typeof calculate>;
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
const compute = (i: Input, context?: ToolExecutionContext) => {
  if (!i.callerReferenceEdition.trim())
    simpleError("edition", "Qualified diagram convention required.");
  const a = records(i.practiceStepsJson).map((r) => {
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
      return simpleError(
        "steps",
        "Explicit task, qualified asset and positive minutes.",
      );
    return { task: r.task, symbolAsset: r.symbolAsset, minutes: r.minutes };
  });
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
    totalMinutes: sum(steps.map((r) => r.minutes)),
    edition: i.callerReferenceEdition,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
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

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          selectedStepIndexes: { type: "array", items: { type: "number" } },
          steps: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                task: { type: "string" },
                minutes: { type: "number" },
                symbolEvidence: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    result: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        values: { type: "array", items: { type: "string" } },
                        selectedEntryIndices: {
                          type: "array",
                          items: { type: "number" },
                        },
                        repertoireSize: { type: "number" },
                        callerReferenceEdition: { type: "string" },
                      },
                      required: [
                        "values",
                        "selectedEntryIndices",
                        "repertoireSize",
                        "callerReferenceEdition",
                      ],
                    },
                  },
                  required: ["result"],
                },
              },
              required: ["task", "minutes", "symbolEvidence"],
            },
          },
          totalMinutes: { type: "number" },
          edition: { type: "string" },
        },
        required: ["selectedStepIndexes", "steps", "totalMinutes", "edition"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
