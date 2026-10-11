import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, catalogIndex } from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerAnnotatedStages: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerAnnotatedStages",
    label: "Caller annotated stages",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  const stages = ["describe", "analyze", "interpret", "judge"],
    indices = input.callerAnnotatedStages.map((v) => catalogIndex(stages, v));
  return {
    missingStages: stages.filter(
      (v) => !input.callerAnnotatedStages.includes(v),
    ),
    descendingStageIndices: indices.flatMap((v, i) =>
      i && v < indices[i - 1] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerAnnotatedStages: ["describe", "analyze", "interpret", "judge"],
  },
  output: { result: { missingStages: [], descendingStageIndices: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/feldman-describe-analyze-interpret-judge-framework",
  title: "FeldmanDescribe-Analyze-Interpret-Judge Framework",
  description:
    "Audit explicitly annotated Feldman describe/analyze/interpret/judge sequence, retaining missing stages and revisits rather than infer criticism quality. Feldman, Varieties of Visual Experience.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missingStages: { type: "array", items: { type: "string" } },
          descendingStageIndices: { type: "array", items: { type: "number" } },
        },
        required: ["missingStages", "descendingStageIndices"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
