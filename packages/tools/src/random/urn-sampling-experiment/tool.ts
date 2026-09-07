import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly physicalItemLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  {
    id: "physicalItemLabels",
    label: "Physical item labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  if (
    !input.physicalItemLabels.length ||
    input.physicalItemLabels.some((v) => !v.trim())
  )
    simpleError(
      "urn",
      "Each physical urn item has a nonempty caller label; repeated labels are allowed.",
    );
  const chosen = indices(input.physicalItemLabels.length, input, random),
    labels = chosen.map((i) => input.physicalItemLabels[i]);
  return {
    result: {
      drawnLabels: labels,
      physicalItemIndices: chosen,
      drawnLabelCounts: [...new Set(labels)].map((label) => ({
        label,
        count: labels.filter((v) => v === label).length,
      })),
      undrawnPhysicalItemIndices: Array.from(
        { length: input.physicalItemLabels.length },
        (_, i) => i,
      ).filter((i) => !chosen.includes(i)),
    },
  };
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
    physicalItemLabels: ["red", "red", "blue"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/urn-sampling-experiment",
  title: "Random Urn Sampling Experiment Generator",
  description:
    "Sample explicit physical urn items with caller replacement convention. Labels may repeat; distinct indices, not colors, are the no-replacement unit. Unused physical inventory retained.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
