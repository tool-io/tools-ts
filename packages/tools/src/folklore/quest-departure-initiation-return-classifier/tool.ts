import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, catalogIndex } from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedPhases: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedPhases",
    label: "Independently annotated phases",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const phases = ["departure", "initiation", "return"];
  const indices = input.independentlyAnnotatedPhases.map((v) =>
    catalogIndex(phases, v),
  );
  return {
    missingPhases: phases.filter(
      (v) => !input.independentlyAnnotatedPhases.includes(v),
    ),
    descendingPhaseIndices: indices.flatMap((v, i) =>
      i && v < indices[i - 1] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedPhases: ["departure", "initiation", "return"],
  },
  output: { result: { missingPhases: [], descendingPhaseIndices: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/quest-departure-initiation-return-classifier",
  title: "Quest Departure Initiation Return Classifier",
  description:
    "Audit caller assigned departure/initiation/return phase order and omissions. Repeats permitted; Campbells comparative scheme is not a universal narrative or psychological law.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
