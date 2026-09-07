import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, points } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedFermiArcPoints: readonly (readonly number[])[];
  readonly callerIndependentlyOrderedSingleArcVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedFermiArcPolylineLength: number;
  readonly observedArcEndpointSeparation: number;
}>;
const inputFields = [
  {
    id: "observedFermiArcPoints",
    label: "Observed fermi arc points",
    kind: "matrix",
  },
  {
    id: "callerIndependentlyOrderedSingleArcVerified",
    label: "Caller independently ordered single arc verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  points(input.observedFermiArcPoints);
  if (
    input.observedFermiArcPoints.length < 2 ||
    !input.callerIndependentlyOrderedSingleArcVerified
  )
    simpleError(
      "arc",
      "At least two independently ordered same-frame reciprocal-space arc points required.",
    );
  const arc = input.observedFermiArcPoints;
  return {
    observedFermiArcPolylineLength: sum(
      arc
        .slice(1)
        .map((p, i) => Math.hypot(p[0] - arc[i][0], p[1] - arc[i][1])),
    ),
    observedArcEndpointSeparation: Math.hypot(
      arc.at(-1)![0] - arc[0][0],
      arc.at(-1)![1] - arc[0][1],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFermiArcPoints: [
    [0, 0],
    [3, 0],
    [3, 4],
  ],
  callerIndependentlyOrderedSingleArcVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedFermiArcPolylineLength: 7,
  observedArcEndpointSeparation: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/weyl-fermi-arc-length",
  title: "Semiconductor Weyl Fermi Arc Length Calculator",
  description:
    "Measure actual independently traced reciprocal-space Fermi-arc polyline and endpoint chord, not Weyl-node 3D separation, geodesy or identification of topology.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFermiArcPolylineLength",
      label: "Observed fermi arc polyline length",
      kind: "number",
    },
    {
      id: "observedArcEndpointSeparation",
      label: "Observed arc endpoint separation",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFermiArcPoints:
        value.observedFermiArcPoints as readonly (readonly number[])[],
      callerIndependentlyOrderedSingleArcVerified:
        value.callerIndependentlyOrderedSingleArcVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
