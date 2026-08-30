import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly eggshellPoreCounts: readonly number[];
  readonly meanPoreDiametersMicrometers: readonly number[];
  readonly examinedShellAreasMm2: readonly number[];
  readonly callerPorosityFractionBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly circularPoreAreaFractions: readonly number[];
  readonly withinCallerPorosityBandFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "eggshellPoreCounts",
    label: "Eggshell pore counts",
    kind: "numberList",
  },
  {
    id: "meanPoreDiametersMicrometers",
    label: "Mean pore diameters micrometers",
    kind: "numberList",
  },
  {
    id: "examinedShellAreasMm2",
    label: "Examined shell areas mm2",
    kind: "numberList",
  },
  {
    id: "callerPorosityFractionBounds",
    label: "Caller porosity fraction bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.meanPoreDiametersMicrometers.forEach((v) =>
    positive(v, "meanPoreDiametersMicrometers"),
  );
  input.examinedShellAreasMm2.forEach((v) =>
    positive(v, "examinedShellAreasMm2"),
  );
  input.callerPorosityFractionBounds.forEach((v) =>
    fraction(v, "callerPorosityFractionBounds"),
  );
  input.eggshellPoreCounts.forEach((v) => count(v, "eggshellPoreCounts"));
  aligned(
    input.eggshellPoreCounts,
    input.meanPoreDiametersMicrometers,
    "eggshellPoreCounts",
  );
  aligned(
    input.eggshellPoreCounts,
    input.examinedShellAreasMm2,
    "eggshellPoreCounts",
  );
  if (
    input.callerPorosityFractionBounds.length !== 2 ||
    input.callerPorosityFractionBounds[0] >
      input.callerPorosityFractionBounds[1]
  )
    simpleError("bounds", "Ordered two-value caller porosity band required.");
  const circularPoreAreaFractions = input.eggshellPoreCounts.map((n, i) =>
    fraction(
      (n * Math.PI * (input.meanPoreDiametersMicrometers[i] / 2000) ** 2) /
        input.examinedShellAreasMm2[i],
      "poreArea",
    ),
  );
  return {
    circularPoreAreaFractions,
    withinCallerPorosityBandFlags: circularPoreAreaFractions.map((v) =>
      v >= input.callerPorosityFractionBounds[0] &&
      v <= input.callerPorosityFractionBounds[1]
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eggshellPoreCounts: [10, 20],
  meanPoreDiametersMicrometers: [10, 20],
  examinedShellAreasMm2: [1, 2],
  callerPorosityFractionBounds: [0.001, 0.01],
} satisfies Input;
export const exampleOutput = {
  circularPoreAreaFractions: [0.0007853981633974483, 0.0031415926535897933],
  withinCallerPorosityBandFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/eggshell-porosity-classifier",
  title: "Eggshell Porosity Incubation Mode Classifier",
  description:
    "Estimate eggshell projected pore area under a monodisperse circular-pore approximation and caller comparison band; mean squared diameter differs from squared mean, and area porosity is not permeability, nesting mode or incubation conditions.",
  inputs: inputFields,
  outputs: [
    {
      id: "circularPoreAreaFractions",
      label: "Circular pore area fractions",
      kind: "numberList",
    },
    {
      id: "withinCallerPorosityBandFlags",
      label: "Within caller porosity band flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      eggshellPoreCounts: value.eggshellPoreCounts as readonly number[],
      meanPoreDiametersMicrometers:
        value.meanPoreDiametersMicrometers as readonly number[],
      examinedShellAreasMm2: value.examinedShellAreasMm2 as readonly number[],
      callerPorosityFractionBounds:
        value.callerPorosityFractionBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
