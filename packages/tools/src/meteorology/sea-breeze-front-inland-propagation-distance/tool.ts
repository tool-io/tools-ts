import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, integral } from "../shared.js";

export type Input = Readonly<{
  readonly observationSeconds: readonly number[];
  readonly frontNormalSpeedsMPerSecond: readonly number[];
  readonly opposingNormalWindMPerSecond: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedInlandPropagationDistanceM: number;
  readonly intervalNormalNetSpeedsMPerSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observationSeconds",
    label: "Observation seconds",
    kind: "numberList",
  },
  {
    id: "frontNormalSpeedsMPerSecond",
    label: "Front normal speeds m per second",
    kind: "numberList",
  },
  {
    id: "opposingNormalWindMPerSecond",
    label: "Opposing normal wind m per second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observationSeconds,
    input.frontNormalSpeedsMPerSecond,
    "observationSeconds",
  );
  aligned(
    input.observationSeconds,
    input.opposingNormalWindMPerSecond,
    "observationSeconds",
  );
  const intervalNormalNetSpeedsMPerSecond =
    input.frontNormalSpeedsMPerSecond.map(
      (v, i) => v - input.opposingNormalWindMPerSecond[i],
    );
  return {
    signedInlandPropagationDistanceM: integral(
      input.observationSeconds,
      intervalNormalNetSpeedsMPerSecond,
    ),
    intervalNormalNetSpeedsMPerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationSeconds: [0, 10, 20],
  frontNormalSpeedsMPerSecond: [1, 2, 3],
  opposingNormalWindMPerSecond: [0.5, 0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  signedInlandPropagationDistanceM: 30,
  intervalNormalNetSpeedsMPerSecond: [0.5, 1.5, 2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/sea-breeze-front-inland-propagation-distance",
  title: "Sea Breeze Front Inland Propagation Distance",
  description:
    "Integrate measured relative sea-breeze front speeds minus declared opposing background flow along fixed caller inland normal; signed retreat remains, no coast coordinates or propagation forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedInlandPropagationDistanceM",
      label: "Signed inland propagation distance m",
      kind: "number",
    },
    {
      id: "intervalNormalNetSpeedsMPerSecond",
      label: "Interval normal net speeds m per second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observationSeconds: value.observationSeconds as readonly number[],
      frontNormalSpeedsMPerSecond:
        value.frontNormalSpeedsMPerSecond as readonly number[],
      opposingNormalWindMPerSecond:
        value.opposingNormalWindMPerSecond as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
