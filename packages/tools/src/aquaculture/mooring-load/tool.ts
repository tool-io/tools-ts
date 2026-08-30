import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly externalHorizontalForcesNewtons: readonly (readonly number[])[];
  readonly anchorDirectionsDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly resultantExternalForceNewtons: readonly number[];
  readonly lineTensionsNewtons: readonly number[];
  readonly equilibriumResidualMagnitudeNewtons: number;
}>;
const inputFields = [
  {
    id: "externalHorizontalForcesNewtons",
    label: "External horizontal forces newtons",
    kind: "matrix",
  },
  {
    id: "anchorDirectionsDegrees",
    label: "Anchor directions degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.externalHorizontalForcesNewtons.length ||
    input.externalHorizontalForcesNewtons.some((row) => row.length !== 2) ||
    input.anchorDirectionsDegrees.length !== 2
  )
    simpleError(
      "externalHorizontalForcesNewtons",
      "Nonempty two-component forces and exactly two horizontal anchor directions required.",
    );
  const f = [
      input.externalHorizontalForcesNewtons.reduce((s, row) => s + row[0], 0),
      input.externalHorizontalForcesNewtons.reduce((s, row) => s + row[1], 0),
    ],
    a = input.anchorDirectionsDegrees.map((v) => (v * Math.PI) / 180),
    x = a.map(Math.cos),
    y = a.map(Math.sin),
    det = x[0] * y[1] - x[1] * y[0];
  if (Math.abs(det) < 1e-10)
    simpleError(
      "anchorDirectionsDegrees",
      "Nonparallel, well-conditioned line directions required.",
    );
  const t = [
    (-f[0] * y[1] + f[1] * x[1]) / det,
    (-f[1] * x[0] + f[0] * y[0]) / det,
  ];
  if (t.some((v) => v < -1e-8 * Math.max(1, Math.hypot(...f))))
    simpleError(
      "anchorDirectionsDegrees",
      "Tension-only lines cannot equilibrate this load direction.",
    );
  const lineTensionsNewtons = t.map((v) => Math.max(0, v));
  return {
    resultantExternalForceNewtons: f,
    lineTensionsNewtons,
    equilibriumResidualMagnitudeNewtons: Math.hypot(
      f[0] + lineTensionsNewtons[0] * x[0] + lineTensionsNewtons[1] * x[1],
      f[1] + lineTensionsNewtons[0] * y[0] + lineTensionsNewtons[1] * y[1],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  externalHorizontalForcesNewtons: [[100, 0]],
  anchorDirectionsDegrees: [150, 210],
} satisfies Input;
export const exampleOutput = {
  resultantExternalForceNewtons: [100, 0],
  lineTensionsNewtons: [57.73502691896258, 57.73502691896258],
  equilibriumResidualMagnitudeNewtons: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/mooring-load",
  title: "Mooring Load",
  description:
    "Solve horizontal two-line tension-only equilibrium for summed caller cage loads and fixed anchor bearings; distinct from windage drag, and catenaries, pretension, vertical load, waves and line strength are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "resultantExternalForceNewtons",
      label: "Resultant external force newtons",
      kind: "numberList",
    },
    {
      id: "lineTensionsNewtons",
      label: "Line tensions newtons",
      kind: "numberList",
    },
    {
      id: "equilibriumResidualMagnitudeNewtons",
      label: "Equilibrium residual magnitude newtons",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      externalHorizontalForcesNewtons:
        value.externalHorizontalForcesNewtons as readonly (readonly number[])[],
      anchorDirectionsDegrees:
        value.anchorDirectionsDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
