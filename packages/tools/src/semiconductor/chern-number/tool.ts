import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedClosedMeshBerryFluxRadians: readonly number[];
  readonly callerIntegerClosenessTolerance: number;
  readonly callerClosedOrientedBrillouinMeshVerified: boolean;
}>;
export type Output = Readonly<{
  readonly rawDiscreteChernSum: number;
  readonly nearestIntegerChernCandidate: number;
  readonly signedIntegerChernResidual: number;
  readonly withinCallerIntegerTolerance: boolean;
}>;
const inputFields = [
  {
    id: "observedClosedMeshBerryFluxRadians",
    label: "Observed closed mesh berry flux radians",
    kind: "numberList",
  },
  {
    id: "callerIntegerClosenessTolerance",
    label: "Caller integer closeness tolerance",
    kind: "number",
  },
  {
    id: "callerClosedOrientedBrillouinMeshVerified",
    label: "Caller closed oriented brillouin mesh verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerIntegerClosenessTolerance,
    "callerIntegerClosenessTolerance",
  );
  if (
    !input.callerClosedOrientedBrillouinMeshVerified ||
    input.callerIntegerClosenessTolerance > 0.5
  )
    simpleError(
      "mesh",
      "Closed oriented mesh evidence and tolerance [0,.5] required.",
    );
  const value = sum(input.observedClosedMeshBerryFluxRadians) / (2 * Math.PI),
    candidate = Math.round(value);
  return {
    rawDiscreteChernSum: value,
    nearestIntegerChernCandidate: candidate,
    signedIntegerChernResidual: value - candidate,
    withinCallerIntegerTolerance:
      Math.abs(value - candidate) <= input.callerIntegerClosenessTolerance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedClosedMeshBerryFluxRadians: [3.141592653589793, 3.141592653589793],
  callerIntegerClosenessTolerance: 0.01,
  callerClosedOrientedBrillouinMeshVerified: true,
} satisfies Input;
export const exampleOutput = {
  rawDiscreteChernSum: 1,
  nearestIntegerChernCandidate: 1,
  signedIntegerChernResidual: 0,
  withinCallerIntegerTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/chern-number",
  title: "Semiconductor Chern Number Calculator",
  description:
    "Audit actual closed oriented Brillouin-mesh Berry flux sum against integer tolerance, raw residual preserved; rounding is not proof of converged/gapped Chern topology.",
  inputs: inputFields,
  outputs: [
    {
      id: "rawDiscreteChernSum",
      label: "Raw discrete chern sum",
      kind: "number",
    },
    {
      id: "nearestIntegerChernCandidate",
      label: "Nearest integer chern candidate",
      kind: "number",
    },
    {
      id: "signedIntegerChernResidual",
      label: "Signed integer chern residual",
      kind: "number",
    },
    {
      id: "withinCallerIntegerTolerance",
      label: "Within caller integer tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedClosedMeshBerryFluxRadians:
        value.observedClosedMeshBerryFluxRadians as readonly number[],
      callerIntegerClosenessTolerance:
        value.callerIntegerClosenessTolerance as number,
      callerClosedOrientedBrillouinMeshVerified:
        value.callerClosedOrientedBrillouinMeshVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
