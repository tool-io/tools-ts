import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly serialStageRecoveries: readonly number[];
  readonly initialMetalKg: number;
}>;
export type Output = Readonly<{
  readonly overallRecoveryFraction: number;
  readonly remainingMetalKgByStage: readonly number[];
  readonly stageLossesKg: readonly number[];
}>;
const inputFields = [
  {
    id: "serialStageRecoveries",
    label: "Serial stage recoveries",
    kind: "numberList",
  },
  { id: "initialMetalKg", label: "Initial metal kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialMetalKg, "initialMetalKg");
  input.serialStageRecoveries.forEach((v) =>
    fraction(v, "serialStageRecoveries"),
  );
  if (!input.serialStageRecoveries.length)
    simpleError(
      "serialStageRecoveries",
      "Nonempty serial recoveries required.",
    );
  let current = input.initialMetalKg;
  const stageLossesKg: number[] = [],
    remainingMetalKgByStage = input.serialStageRecoveries.map((v) => {
      const next = current * v;
      stageLossesKg.push(current - next);
      current = next;
      return next;
    });
  return {
    overallRecoveryFraction: current / input.initialMetalKg,
    remainingMetalKgByStage,
    stageLossesKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  serialStageRecoveries: [0.8, 0.9, 0.5],
  initialMetalKg: 100,
} satisfies Input;
export const exampleOutput = {
  overallRecoveryFraction: 0.36,
  remainingMetalKgByStage: [80, 72, 36],
  stageLossesKg: [20, 8, 36],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/overall-recovery",
  title: "Overall Recovery",
  description:
    "Propagate inventory through serial conditional recoveries and expose losses; parallel-stream recoveries must not be multiplied.",
  inputs: inputFields,
  outputs: [
    {
      id: "overallRecoveryFraction",
      label: "Overall recovery fraction",
      kind: "number",
    },
    {
      id: "remainingMetalKgByStage",
      label: "Remaining metal kg by stage",
      kind: "numberList",
    },
    { id: "stageLossesKg", label: "Stage losses kg", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      serialStageRecoveries: value.serialStageRecoveries as readonly number[],
      initialMetalKg: value.initialMetalKg as number,
    }),
});
export const run = tool.execute;
export default tool;
