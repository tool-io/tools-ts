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
  ordered,
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly displacementsMm: readonly number[];
  readonly groundPressuresMpa: readonly number[];
  readonly supportPressuresMpa: readonly number[];
}>;
export type Output = Readonly<{
  readonly equilibriumDisplacementMm: number;
  readonly equilibriumPressureMpa: number;
}>;
const inputFields = [
  { id: "displacementsMm", label: "Displacements mm", kind: "numberList" },
  {
    id: "groundPressuresMpa",
    label: "Ground pressures mpa",
    kind: "numberList",
  },
  {
    id: "supportPressuresMpa",
    label: "Support pressures mpa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.displacementsMm.forEach((v) => nonnegative(v, "displacementsMm"));
  input.groundPressuresMpa.forEach((v) => nonnegative(v, "groundPressuresMpa"));
  input.supportPressuresMpa.forEach((v) =>
    nonnegative(v, "supportPressuresMpa"),
  );
  aligned(input.displacementsMm, input.groundPressuresMpa, "displacementsMm");
  aligned(input.displacementsMm, input.supportPressuresMpa, "displacementsMm");
  ordered(input.displacementsMm, "displacementsMm");
  const roots: number[] = [];
  for (let i = 0; i < input.displacementsMm.length; i++) {
    const d = input.groundPressuresMpa[i] - input.supportPressuresMpa[i];
    if (d === 0) roots.push(input.displacementsMm[i]);
    if (i) {
      const p =
        input.groundPressuresMpa[i - 1] - input.supportPressuresMpa[i - 1];
      if (p === 0 && d === 0)
        simpleError(
          "supportPressuresMpa",
          "Coincident interval has nonunique equilibrium.",
        );
      if (Math.sign(p) * Math.sign(d) < 0)
        roots.push(
          input.displacementsMm[i - 1] +
            ((input.displacementsMm[i] - input.displacementsMm[i - 1]) * p) /
              (p - d),
        );
    }
  }
  if (roots.length !== 1)
    simpleError(
      "supportPressuresMpa",
      "Exactly one observed equilibrium required; no extrapolation or arbitrary root selection.",
    );
  const equilibriumDisplacementMm = roots[0];
  return {
    equilibriumDisplacementMm,
    equilibriumPressureMpa: interpolate(
      input.displacementsMm,
      input.groundPressuresMpa,
      equilibriumDisplacementMm,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  displacementsMm: [0, 10, 20],
  groundPressuresMpa: [2, 1, 0.5],
  supportPressuresMpa: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  equilibriumDisplacementMm: 15,
  equilibriumPressureMpa: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ground-support-interaction",
  title: "Ground Support Interaction",
  description:
    "Intersect piecewise-linear supplied ground/support curves within bounds; missing, multiple and coincident equilibria are errors, not stability certifications.",
  inputs: inputFields,
  outputs: [
    {
      id: "equilibriumDisplacementMm",
      label: "Equilibrium displacement mm",
      kind: "number",
    },
    {
      id: "equilibriumPressureMpa",
      label: "Equilibrium pressure mpa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      displacementsMm: value.displacementsMm as readonly number[],
      groundPressuresMpa: value.groundPressuresMpa as readonly number[],
      supportPressuresMpa: value.supportPressuresMpa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
