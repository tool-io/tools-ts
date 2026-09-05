import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, classified } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyClassifiedTonnes: readonly number[];
  readonly callerIndependentClassLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchedTotal: number;
  readonly matchedCount: number;
  readonly unclassifiedCount: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyClassifiedTonnes",
    label: "Observed already classified tonnes",
    kind: "numberList",
  },
  {
    id: "callerIndependentClassLabels",
    label: "Caller independent class labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return classified(
    input.observedAlreadyClassifiedTonnes,
    input.callerIndependentClassLabels,
    "inferred",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyClassifiedTonnes: [10, 20, 5],
  callerIndependentClassLabels: ["inferred", "other", "unknown"],
} satisfies Input;
export const exampleOutput = {
  matchedTotal: 10,
  matchedCount: 1,
  unclassifiedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mineral-resource-inferred",
  title: "Inferred Mineral Resource Calculator",
  description:
    "Summarize explicitly already independently classified inferred dry-tonnage inventory, unknown labels remain separate; no geological/economic classification, reserve declaration or confidence inferred. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "matchedTotal", label: "Matched total", kind: "number" },
    { id: "matchedCount", label: "Matched count", kind: "number" },
    { id: "unclassifiedCount", label: "Unclassified count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyClassifiedTonnes:
        value.observedAlreadyClassifiedTonnes as readonly number[],
      callerIndependentClassLabels:
        value.callerIndependentClassLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
