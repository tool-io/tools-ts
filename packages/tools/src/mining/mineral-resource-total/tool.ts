import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerResourceBlockIds: readonly string[];
  readonly observedResourceDryTonnes: readonly number[];
  readonly callerIndependentResourceClassLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly knownClassifiedInventoryTonnes: number;
  readonly unclassifiedInventoryTonnes: number;
}>;
const inputFields = [
  {
    id: "callerResourceBlockIds",
    label: "Caller resource block ids",
    kind: "stringList",
  },
  {
    id: "observedResourceDryTonnes",
    label: "Observed resource dry tonnes",
    kind: "numberList",
  },
  {
    id: "callerIndependentResourceClassLabels",
    label: "Caller independent resource class labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedResourceDryTonnes.forEach((v) =>
    nonnegative(v, "observedResourceDryTonnes"),
  );
  aligned(
    input.callerResourceBlockIds,
    input.observedResourceDryTonnes,
    "callerResourceBlockIds",
  );
  aligned(
    input.callerResourceBlockIds,
    input.callerIndependentResourceClassLabels,
    "callerResourceBlockIds",
  );
  unique(input.callerResourceBlockIds, "blocks");
  const allowed = ["measured", "indicated", "inferred"];
  if (
    input.callerIndependentResourceClassLabels.some(
      (s) => !allowed.includes(s) && s !== "unknown",
    )
  )
    simpleError(
      "classes",
      "Only independently assigned named classes or explicit unknown, no reserves/resources cross-addition.",
    );
  return {
    knownClassifiedInventoryTonnes: sum(
      input.observedResourceDryTonnes.filter((_, i) =>
        allowed.includes(input.callerIndependentResourceClassLabels[i]),
      ),
    ),
    unclassifiedInventoryTonnes: sum(
      input.observedResourceDryTonnes.filter(
        (_, i) => input.callerIndependentResourceClassLabels[i] === "unknown",
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerResourceBlockIds: ["a", "b", "c"],
  observedResourceDryTonnes: [10, 20, 5],
  callerIndependentResourceClassLabels: ["measured", "inferred", "unknown"],
} satisfies Input;
export const exampleOutput = {
  knownClassifiedInventoryTonnes: 30,
  unclassifiedInventoryTonnes: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mineral-resource-total",
  title: "Total Mineral Resource Calculator",
  description:
    "Reconcile nonduplicate already classified resource blocks with unknown inventory, no reserve/resource overlapping categories added together or new geological classification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownClassifiedInventoryTonnes",
      label: "Known classified inventory tonnes",
      kind: "number",
    },
    {
      id: "unclassifiedInventoryTonnes",
      label: "Unclassified inventory tonnes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerResourceBlockIds: value.callerResourceBlockIds as readonly string[],
      observedResourceDryTonnes:
        value.observedResourceDryTonnes as readonly number[],
      callerIndependentResourceClassLabels:
        value.callerIndependentResourceClassLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
