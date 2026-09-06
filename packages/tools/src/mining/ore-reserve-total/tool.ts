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
  readonly callerReserveBlockIds: readonly string[];
  readonly observedReserveDryTonnes: readonly number[];
  readonly callerIndependentReserveClassLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly knownClassifiedInventoryTonnes: number;
  readonly unclassifiedInventoryTonnes: number;
}>;
const inputFields = [
  {
    id: "callerReserveBlockIds",
    label: "Caller reserve block ids",
    kind: "stringList",
  },
  {
    id: "observedReserveDryTonnes",
    label: "Observed reserve dry tonnes",
    kind: "numberList",
  },
  {
    id: "callerIndependentReserveClassLabels",
    label: "Caller independent reserve class labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedReserveDryTonnes.forEach((v) =>
    nonnegative(v, "observedReserveDryTonnes"),
  );
  aligned(
    input.callerReserveBlockIds,
    input.observedReserveDryTonnes,
    "callerReserveBlockIds",
  );
  aligned(
    input.callerReserveBlockIds,
    input.callerIndependentReserveClassLabels,
    "callerReserveBlockIds",
  );
  unique(input.callerReserveBlockIds, "blocks");
  const allowed = ["proved", "probable"];
  if (
    input.callerIndependentReserveClassLabels.some(
      (s) => !allowed.includes(s) && s !== "unknown",
    )
  )
    simpleError(
      "classes",
      "Only independently assigned named classes or explicit unknown, no reserves/resources cross-addition.",
    );
  return {
    knownClassifiedInventoryTonnes: sum(
      input.observedReserveDryTonnes.filter((_, i) =>
        allowed.includes(input.callerIndependentReserveClassLabels[i]),
      ),
    ),
    unclassifiedInventoryTonnes: sum(
      input.observedReserveDryTonnes.filter(
        (_, i) => input.callerIndependentReserveClassLabels[i] === "unknown",
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReserveBlockIds: ["a", "b", "c"],
  observedReserveDryTonnes: [10, 20, 5],
  callerIndependentReserveClassLabels: ["proved", "probable", "unknown"],
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
  id: "mining/ore-reserve-total",
  title: "Total Ore Reserve Calculator",
  description:
    "Reconcile nonduplicate already classified reserve blocks with unknown inventory, no reserve/resource overlapping categories added together or new geological classification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      callerReserveBlockIds: value.callerReserveBlockIds as readonly string[],
      observedReserveDryTonnes:
        value.observedReserveDryTonnes as readonly number[],
      callerIndependentReserveClassLabels:
        value.callerIndependentReserveClassLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
