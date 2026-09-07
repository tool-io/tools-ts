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
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedWellTransmissionFractions: readonly number[];
  readonly observedWellReflectanceFractions: readonly number[];
  readonly observedOpticalPathLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredWellAbsorptionPerMeter: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWellTransmissionFractions",
    label: "Observed well transmission fractions",
    kind: "numberList",
  },
  {
    id: "observedWellReflectanceFractions",
    label: "Observed well reflectance fractions",
    kind: "numberList",
  },
  {
    id: "observedOpticalPathLengthsM",
    label: "Observed optical path lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWellTransmissionFractions.forEach((v) =>
    positive(v, "observedWellTransmissionFractions"),
  );
  input.observedOpticalPathLengthsM.forEach((v) =>
    positive(v, "observedOpticalPathLengthsM"),
  );
  input.observedWellTransmissionFractions.forEach((v) =>
    fraction(v, "observedWellTransmissionFractions"),
  );
  input.observedWellReflectanceFractions.forEach((v) =>
    fraction(v, "observedWellReflectanceFractions"),
  );
  aligned(
    input.observedWellTransmissionFractions,
    input.observedWellReflectanceFractions,
    "observedWellTransmissionFractions",
  );
  aligned(
    input.observedWellTransmissionFractions,
    input.observedOpticalPathLengthsM,
    "observedWellTransmissionFractions",
  );
  return {
    inferredWellAbsorptionPerMeter: input.observedWellTransmissionFractions.map(
      (v, i) => {
        const entry = 1 - input.observedWellReflectanceFractions[i];
        positive(entry, "entry");
        if (v > entry)
          simpleError(
            "transmission",
            "Transmission cannot exceed reflected-entry remainder for this single-pass branch.",
          );
        return -Math.log(v / entry) / input.observedOpticalPathLengthsM[i];
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWellTransmissionFractions: [0.5, 0.25],
  observedWellReflectanceFractions: [0, 0.2],
  observedOpticalPathLengthsM: [1, 2],
} satisfies Input;
export const exampleOutput = {
  inferredWellAbsorptionPerMeter: [0.6931471805599453, 0.5815754049028404],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/quantum-well-absorption-coefficient",
  title: "Semiconductor Quantum Well Absorption Coefficient Calculator",
  description:
    "Infer actual quantum-well single-pass absorption after independently measured entry reflection, not bare transmission Beer-law or multiple-reflection model.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredWellAbsorptionPerMeter",
      label: "Inferred well absorption per meter",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWellTransmissionFractions:
        value.observedWellTransmissionFractions as readonly number[],
      observedWellReflectanceFractions:
        value.observedWellReflectanceFractions as readonly number[],
      observedOpticalPathLengthsM:
        value.observedOpticalPathLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
