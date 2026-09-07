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
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedErfcDepthsM: readonly number[];
  readonly callerMeasuredErfcConcentrations: readonly number[];
  readonly callerBackgroundConcentration: number;
}>;
export type Output = Readonly<{
  readonly measuredErfcBackgroundCrossingDepthsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedErfcDepthsM",
    label: "Observed erfc depths m",
    kind: "numberList",
  },
  {
    id: "callerMeasuredErfcConcentrations",
    label: "Caller measured erfc concentrations",
    kind: "numberList",
  },
  {
    id: "callerBackgroundConcentration",
    label: "Caller background concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedErfcDepthsM.forEach((v) =>
    nonnegative(v, "observedErfcDepthsM"),
  );
  input.callerMeasuredErfcConcentrations.forEach((v) =>
    nonnegative(v, "callerMeasuredErfcConcentrations"),
  );
  nonnegative(
    input.callerBackgroundConcentration,
    "callerBackgroundConcentration",
  );
  if (
    input.callerMeasuredErfcConcentrations.some(
      (v, i) => i > 0 && v > input.callerMeasuredErfcConcentrations[i - 1],
    )
  )
    simpleError(
      "profile",
      "Caller independently verified monotone erfc-like depth profile required.",
    );
  return {
    measuredErfcBackgroundCrossingDepthsM: crossings(
      input.observedErfcDepthsM,
      input.callerMeasuredErfcConcentrations,
      input.callerBackgroundConcentration,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedErfcDepthsM: [0, 1, 2],
  callerMeasuredErfcConcentrations: [100, 60, 20],
  callerBackgroundConcentration: 40,
} satisfies Input;
export const exampleOutput = {
  measuredErfcBackgroundCrossingDepthsM: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/junction-depth-erfc",
  title: "Semiconductor Junction Depth Erfc Calculator",
  description:
    "Extract background crossings from actual independently verified monotone erfc-like depth measurements by piecewise linear interpolation, no assumed Gaussian fit or fabricated erfc solver.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredErfcBackgroundCrossingDepthsM",
      label: "Measured erfc background crossing depths m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedErfcDepthsM: value.observedErfcDepthsM as readonly number[],
      callerMeasuredErfcConcentrations:
        value.callerMeasuredErfcConcentrations as readonly number[],
      callerBackgroundConcentration:
        value.callerBackgroundConcentration as number,
    }),
});
export const run = tool.execute;
export default tool;
