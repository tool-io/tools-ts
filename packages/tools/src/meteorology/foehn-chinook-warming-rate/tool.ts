import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly upwindSurfaceTemperatureC: number;
  readonly upwindHeightM: number;
  readonly crestHeightM: number;
  readonly leeSurfaceHeightM: number;
  readonly suppliedWindwardLclHeightM: number;
  readonly callerDryLapseCPerKm: number;
  readonly callerSaturatedLapseCPerKm: number;
}>;
export type Output = Readonly<{
  readonly modelCrestTemperatureC: number;
  readonly modelLeeSurfaceTemperatureC: number;
  readonly modelLeeMinusUpwindWarmingC: number;
}>;
const inputFields = [
  {
    id: "upwindSurfaceTemperatureC",
    label: "Upwind surface temperature c",
    kind: "number",
  },
  { id: "upwindHeightM", label: "Upwind height m", kind: "number" },
  { id: "crestHeightM", label: "Crest height m", kind: "number" },
  { id: "leeSurfaceHeightM", label: "Lee surface height m", kind: "number" },
  {
    id: "suppliedWindwardLclHeightM",
    label: "Supplied windward lcl height m",
    kind: "number",
  },
  {
    id: "callerDryLapseCPerKm",
    label: "Caller dry lapse c per km",
    kind: "number",
  },
  {
    id: "callerSaturatedLapseCPerKm",
    label: "Caller saturated lapse c per km",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerDryLapseCPerKm, "callerDryLapseCPerKm");
  nonnegative(input.callerSaturatedLapseCPerKm, "callerSaturatedLapseCPerKm");
  if (
    input.crestHeightM < input.upwindHeightM ||
    input.crestHeightM < input.leeSurfaceHeightM ||
    input.suppliedWindwardLclHeightM < input.upwindHeightM
  )
    simpleError(
      "heights",
      "Crest above both surfaces and LCL no lower than upwind origin required.",
    );
  const dry =
      Math.min(input.crestHeightM, input.suppliedWindwardLclHeightM) -
      input.upwindHeightM,
    wet = Math.max(0, input.crestHeightM - input.suppliedWindwardLclHeightM),
    modelCrestTemperatureC =
      input.upwindSurfaceTemperatureC -
      (dry * input.callerDryLapseCPerKm +
        wet * input.callerSaturatedLapseCPerKm) /
        1000,
    modelLeeSurfaceTemperatureC =
      modelCrestTemperatureC +
      ((input.crestHeightM - input.leeSurfaceHeightM) *
        input.callerDryLapseCPerKm) /
        1000;
  return {
    modelCrestTemperatureC,
    modelLeeSurfaceTemperatureC,
    modelLeeMinusUpwindWarmingC:
      modelLeeSurfaceTemperatureC - input.upwindSurfaceTemperatureC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upwindSurfaceTemperatureC: 20,
  upwindHeightM: 0,
  crestHeightM: 2000,
  leeSurfaceHeightM: 0,
  suppliedWindwardLclHeightM: 1000,
  callerDryLapseCPerKm: 10,
  callerSaturatedLapseCPerKm: 5,
} satisfies Input;
export const exampleOutput = {
  modelCrestTemperatureC: 5,
  modelLeeSurfaceTemperatureC: 25,
  modelLeeMinusUpwindWarmingC: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/foehn-chinook-warming-rate",
  title: "Foehn Chinook Warming Rate",
  description:
    "Model windward dry/saturated ascent then dry lee descent with supplied crest/LCL/lapse rates; explicit rainout/unsaturated descent idealization, not actual Chinook event or environmental profile fit.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelCrestTemperatureC",
      label: "Model crest temperature c",
      kind: "number",
    },
    {
      id: "modelLeeSurfaceTemperatureC",
      label: "Model lee surface temperature c",
      kind: "number",
    },
    {
      id: "modelLeeMinusUpwindWarmingC",
      label: "Model lee minus upwind warming c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      upwindSurfaceTemperatureC: value.upwindSurfaceTemperatureC as number,
      upwindHeightM: value.upwindHeightM as number,
      crestHeightM: value.crestHeightM as number,
      leeSurfaceHeightM: value.leeSurfaceHeightM as number,
      suppliedWindwardLclHeightM: value.suppliedWindwardLclHeightM as number,
      callerDryLapseCPerKm: value.callerDryLapseCPerKm as number,
      callerSaturatedLapseCPerKm: value.callerSaturatedLapseCPerKm as number,
    }),
});
export const run = tool.execute;
export default tool;
