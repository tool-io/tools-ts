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
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly layerThicknessesM: readonly number[];
  readonly extinctionCoefficientsPerMeter: readonly number[];
  readonly surfaceIrradiance: number;
}>;
export type Output = Readonly<{
  readonly boundaryDepthsM: readonly number[];
  readonly boundaryIrradiances: readonly number[];
}>;
const inputFields = [
  { id: "layerThicknessesM", label: "Layer thicknesses m", kind: "numberList" },
  {
    id: "extinctionCoefficientsPerMeter",
    label: "Extinction coefficients per meter",
    kind: "numberList",
  },
  { id: "surfaceIrradiance", label: "Surface irradiance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.layerThicknessesM.length >= 100000)
    simpleError(
      "layerThicknessesM",
      "Boundary vectors exceed the generated-value budget.",
    );
  input.layerThicknessesM.forEach((v) => positive(v, "layerThicknessesM"));
  input.extinctionCoefficientsPerMeter.forEach((v) =>
    nonnegative(v, "extinctionCoefficientsPerMeter"),
  );
  nonnegative(input.surfaceIrradiance, "surfaceIrradiance");
  aligned(
    input.layerThicknessesM,
    input.extinctionCoefficientsPerMeter,
    "layerThicknessesM",
  );
  let depth = 0,
    tau = 0;
  const boundaryDepthsM = [0],
    boundaryIrradiances = [input.surfaceIrradiance];
  input.layerThicknessesM.forEach((v, i) => {
    depth += v;
    tau += v * input.extinctionCoefficientsPerMeter[i];
    boundaryDepthsM.push(depth);
    boundaryIrradiances.push(input.surfaceIrradiance * Math.exp(-tau));
  });
  return { boundaryDepthsM, boundaryIrradiances };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerThicknessesM: [1, 2],
  extinctionCoefficientsPerMeter: [0.1, 0.2],
  surfaceIrradiance: 100,
} satisfies Input;
export const exampleOutput = {
  boundaryDepthsM: [0, 1, 3],
  boundaryIrradiances: [100, 90.48374180359595, 60.653065971263345],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/light-attenuation-vertical-profile",
  title: "Light Attenuation Vertical Profile",
  description:
    "Propagate downwelling irradiance through layered Beer–Lambert extinction; supplied coefficients include only modeled optical attenuation and no bottom reflection.",
  inputs: inputFields,
  outputs: [
    { id: "boundaryDepthsM", label: "Boundary depths m", kind: "numberList" },
    {
      id: "boundaryIrradiances",
      label: "Boundary irradiances",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      layerThicknessesM: value.layerThicknessesM as readonly number[],
      extinctionCoefficientsPerMeter:
        value.extinctionCoefficientsPerMeter as readonly number[],
      surfaceIrradiance: value.surfaceIrradiance as number,
    }),
});
export const run = tool.execute;
export default tool;
