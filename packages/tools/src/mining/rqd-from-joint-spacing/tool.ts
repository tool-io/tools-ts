import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMeanNormalJointSpacingsM: readonly number[];
  readonly callerPoissonFractureBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly poissonModelRqdPercent: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMeanNormalJointSpacingsM",
    label: "Observed mean normal joint spacings m",
    kind: "numberList",
  },
  {
    id: "callerPoissonFractureBranchVerified",
    label: "Caller poisson fracture branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMeanNormalJointSpacingsM.forEach((v) =>
    positive(v, "observedMeanNormalJointSpacingsM"),
  );
  if (!input.callerPoissonFractureBranchVerified)
    simpleError(
      "fractures",
      "Independent memoryless Poisson normal fracture branch required.",
    );
  return {
    poissonModelRqdPercent: input.observedMeanNormalJointSpacingsM.map((v) => {
      const x = 0.1 / v;
      return 100 * (1 + x) * Math.exp(-x);
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMeanNormalJointSpacingsM: [0.1, 0.2],
  callerPoissonFractureBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  poissonModelRqdPercent: [73.57588823428847, 90.97959895689502],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/rqd-from-joint-spacing",
  title: "RQD From Joint Spacing Calculator",
  description:
    "Named Poisson fracture RQD=100(1+0.1λ) e^(−0.1λ), λ=1/mean normal spacing; not observed core-piece RQD, Jv conversion or validated rock mass class. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "poissonModelRqdPercent",
      label: "Poisson model rqd percent",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMeanNormalJointSpacingsM:
        value.observedMeanNormalJointSpacingsM as readonly number[],
      callerPoissonFractureBranchVerified:
        value.callerPoissonFractureBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
