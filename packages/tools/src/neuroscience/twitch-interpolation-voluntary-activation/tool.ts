import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly superimposedTwitchNewtons: readonly number[];
  readonly potentiatedRestTwitchNewtons: readonly number[];
}>;
export type Output = Readonly<{
  readonly trialActivationPercents: readonly number[];
  readonly meanActivationPercent: number;
}>;
const inputFields = [
  {
    id: "superimposedTwitchNewtons",
    label: "Superimposed twitch newtons",
    kind: "numberList",
  },
  {
    id: "potentiatedRestTwitchNewtons",
    label: "Potentiated rest twitch newtons",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.superimposedTwitchNewtons,
    input.potentiatedRestTwitchNewtons,
    "superimposedTwitchNewtons",
  );
  input.superimposedTwitchNewtons.forEach((v) =>
    nonnegative(v, "superimposedTwitchNewtons"),
  );
  input.potentiatedRestTwitchNewtons.forEach((v) =>
    positive(v, "potentiatedRestTwitchNewtons"),
  );
  const trialActivationPercents = input.superimposedTwitchNewtons.map(
    (v, i) => 100 * (1 - v / input.potentiatedRestTwitchNewtons[i]),
  );
  return {
    trialActivationPercents,
    meanActivationPercent: mean(trialActivationPercents),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  superimposedTwitchNewtons: [10, 20],
  potentiatedRestTwitchNewtons: [100, 100],
} satisfies Input;
export const exampleOutput = {
  trialActivationPercents: [90, 80],
  meanActivationPercent: 85,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/twitch-interpolation-voluntary-activation",
  title: "Twitch Interpolation Voluntary Activation",
  description:
    "Calculate paired trial voluntary activation as 100·(1−superimposed/rest potentiated twitch); negative estimates are preserved to expose model/protocol incompatibility, not clipped.",
  inputs: inputFields,
  outputs: [
    {
      id: "trialActivationPercents",
      label: "Trial activation percents",
      kind: "numberList",
    },
    {
      id: "meanActivationPercent",
      label: "Mean activation percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      superimposedTwitchNewtons:
        value.superimposedTwitchNewtons as readonly number[],
      potentiatedRestTwitchNewtons:
        value.potentiatedRestTwitchNewtons as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
