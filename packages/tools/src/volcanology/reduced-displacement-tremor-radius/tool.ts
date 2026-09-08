import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedTremorDisplacementCm: readonly number[];
  readonly callerMatchedSourceDistancesCm: readonly number[];
  readonly callerMatchedSurfaceWaveLengthsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly surfaceWaveReducedDisplacementsCm2: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTremorDisplacementCm",
    label: "Observed tremor displacement cm",
    kind: "numberList",
  },
  {
    id: "callerMatchedSourceDistancesCm",
    label: "Caller matched source distances cm",
    kind: "numberList",
  },
  {
    id: "callerMatchedSurfaceWaveLengthsCm",
    label: "Caller matched surface wave lengths cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedSourceDistancesCm.forEach((v) =>
    positive(v, "callerMatchedSourceDistancesCm"),
  );
  input.callerMatchedSurfaceWaveLengthsCm.forEach((v) =>
    positive(v, "callerMatchedSurfaceWaveLengthsCm"),
  );
  input.observedTremorDisplacementCm.forEach((v) =>
    nonnegative(v, "observedTremorDisplacementCm"),
  );
  aligned(
    input.observedTremorDisplacementCm,
    input.callerMatchedSourceDistancesCm,
    "observedTremorDisplacementCm",
  );
  aligned(
    input.observedTremorDisplacementCm,
    input.callerMatchedSurfaceWaveLengthsCm,
    "observedTremorDisplacementCm",
  );
  return {
    surfaceWaveReducedDisplacementsCm2: input.observedTremorDisplacementCm.map(
      (v, i) =>
        v *
        Math.sqrt(
          input.callerMatchedSourceDistancesCm[i] *
            input.callerMatchedSurfaceWaveLengthsCm[i],
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTremorDisplacementCm: [1, 2],
  callerMatchedSourceDistancesCm: [100, 400],
  callerMatchedSurfaceWaveLengthsCm: [100, 100],
} satisfies Input;
export const exampleOutput = {
  surfaceWaveReducedDisplacementsCm2: [100, 400],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/reduced-displacement-tremor-radius",
  title: "Reduced Displacement Tremor Radius Calculator",
  description:
    "Surface-wave reduced displacement DR=A√(rλ) with all lengthsCM and outputCM², instrument response/distance correction independently matched, not tremor energy or eruption forecast. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "surfaceWaveReducedDisplacementsCm2",
      label: "Surface wave reduced displacements cm2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTremorDisplacementCm:
        value.observedTremorDisplacementCm as readonly number[],
      callerMatchedSourceDistancesCm:
        value.callerMatchedSourceDistancesCm as readonly number[],
      callerMatchedSurfaceWaveLengthsCm:
        value.callerMatchedSurfaceWaveLengthsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
