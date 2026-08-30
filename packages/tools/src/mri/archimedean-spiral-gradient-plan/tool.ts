import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly turns: number;
  readonly maximumRadiusCyclesPerMeter: number;
  readonly gammaHzPerTesla: number;
}>;
export type Output = Readonly<{
  readonly kCoordinates: readonly (readonly number[])[];
  readonly gradientMilliTeslaPerMeter: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList", unit: "s" },
  { id: "turns", label: "Turns", kind: "number" },
  {
    id: "maximumRadiusCyclesPerMeter",
    label: "Maximum radius cycles per meter",
    kind: "number",
  },
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.timesSeconds, "timesSeconds");
  if (input.timesSeconds[0] !== 0 || input.timesSeconds.length > 128)
    simpleError(
      "timesSeconds",
      "At most 128 times beginning at zero required.",
    );
  positive(input.turns, "turns");
  positive(input.maximumRadiusCyclesPerMeter, "maximumRadiusCyclesPerMeter");
  positive(input.gammaHzPerTesla, "gammaHzPerTesla");
  const duration = input.timesSeconds.at(-1)!,
    radialRate = input.maximumRadiusCyclesPerMeter / duration,
    omega = (2 * Math.PI * input.turns) / duration,
    kCoordinates = input.timesSeconds.map((t) => [
      radialRate * t * Math.cos(omega * t),
      radialRate * t * Math.sin(omega * t),
    ]),
    gradientMilliTeslaPerMeter = input.timesSeconds.map((t) => [
      (1000 / input.gammaHzPerTesla) *
        (radialRate * Math.cos(omega * t) -
          radialRate * t * omega * Math.sin(omega * t)),
      (1000 / input.gammaHzPerTesla) *
        (radialRate * Math.sin(omega * t) +
          radialRate * t * omega * Math.cos(omega * t)),
    ]);
  return { kCoordinates, gradientMilliTeslaPerMeter };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 0.25, 0.5],
  turns: 1,
  maximumRadiusCyclesPerMeter: 1,
  gammaHzPerTesla: 1,
} satisfies Input;
export const exampleOutput = {
  kCoordinates: [
    [0, 0],
    [-0.5, 0],
    [1, 0],
  ],
  gradientMilliTeslaPerMeter: [
    [2000, 0],
    [-2000, -6283.185307179586],
    [2000, 12566.370614359172],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/archimedean-spiral-gradient-plan",
  title: "Spiral K-Space Trajectory",
  description:
    "Plan an Archimedean k-space spiral and its analytic gradient derivative for a supplied duration, radius and turn count; no gradient/slew constrained optimization is performed.",
  inputs: inputFields,
  outputs: [
    { id: "kCoordinates", label: "K coordinates", kind: "matrix" },
    {
      id: "gradientMilliTeslaPerMeter",
      label: "Gradient milli tesla per meter",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      turns: value.turns as number,
      maximumRadiusCyclesPerMeter: value.maximumRadiusCyclesPerMeter as number,
      gammaHzPerTesla: value.gammaHzPerTesla as number,
    }),
});
export const run = tool.execute;
export default tool;
