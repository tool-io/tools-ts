import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly residenceTimesSeconds: readonly number[];
  readonly incidentIrradiancesMwPerCm2: readonly number[];
  readonly waterTransmittanceFraction: number;
  readonly relativePathLengths: readonly number[];
}>;
export type Output = Readonly<{
  readonly localIrradiancesMwPerCm2: readonly number[];
  readonly integratedFluenceMjPerCm2: number;
}>;
const inputFields = [
  {
    id: "residenceTimesSeconds",
    label: "Residence times seconds",
    kind: "numberList",
  },
  {
    id: "incidentIrradiancesMwPerCm2",
    label: "Incident irradiances mw per cm2",
    kind: "numberList",
  },
  {
    id: "waterTransmittanceFraction",
    label: "Water transmittance fraction",
    kind: "number",
  },
  {
    id: "relativePathLengths",
    label: "Relative path lengths",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterTransmittanceFraction, "waterTransmittanceFraction");
  input.residenceTimesSeconds.forEach((v) =>
    nonnegative(v, "residenceTimesSeconds"),
  );
  input.incidentIrradiancesMwPerCm2.forEach((v) =>
    nonnegative(v, "incidentIrradiancesMwPerCm2"),
  );
  input.relativePathLengths.forEach((v) =>
    nonnegative(v, "relativePathLengths"),
  );
  fraction(input.waterTransmittanceFraction, "waterTransmittanceFraction");
  aligned(
    input.residenceTimesSeconds,
    input.incidentIrradiancesMwPerCm2,
    "residenceTimesSeconds",
  );
  aligned(
    input.residenceTimesSeconds,
    input.relativePathLengths,
    "residenceTimesSeconds",
  );
  const localIrradiancesMwPerCm2 = input.incidentIrradiancesMwPerCm2.map(
    (v, i) =>
      v * input.waterTransmittanceFraction ** input.relativePathLengths[i],
  );
  return {
    localIrradiancesMwPerCm2,
    integratedFluenceMjPerCm2: integral(
      input.residenceTimesSeconds,
      localIrradiancesMwPerCm2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  residenceTimesSeconds: [0, 1, 2],
  incidentIrradiancesMwPerCm2: [1, 2, 1],
  waterTransmittanceFraction: 0.8,
  relativePathLengths: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  localIrradiancesMwPerCm2: [1, 1.6, 0.64],
  integratedFluenceMjPerCm2: 2.42,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/uv-dose",
  title: "UV Dose Calculator Aquaculture",
  description:
    "Integrate sampled trajectory UV irradiance attenuated by caller transmittance per reference path length; mW·s/cm² yields mJ/cm², not reactor validated reduction-equivalent dose or pathogen kill.",
  inputs: inputFields,
  outputs: [
    {
      id: "localIrradiancesMwPerCm2",
      label: "Local irradiances mw per cm2",
      kind: "numberList",
    },
    {
      id: "integratedFluenceMjPerCm2",
      label: "Integrated fluence mj per cm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      residenceTimesSeconds: value.residenceTimesSeconds as readonly number[],
      incidentIrradiancesMwPerCm2:
        value.incidentIrradiancesMwPerCm2 as readonly number[],
      waterTransmittanceFraction: value.waterTransmittanceFraction as number,
      relativePathLengths: value.relativePathLengths as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
