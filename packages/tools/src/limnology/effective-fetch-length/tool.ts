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
  readonly relativeBearingDegrees: readonly number[];
  readonly radialFetchesM: readonly number[];
}>;
export type Output = Readonly<{
  readonly cosineWeightedEffectiveFetchM: number;
}>;
const inputFields = [
  {
    id: "relativeBearingDegrees",
    label: "Relative bearing degrees",
    kind: "numberList",
  },
  { id: "radialFetchesM", label: "Radial fetches m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.radialFetchesM.forEach((v) => nonnegative(v, "radialFetchesM"));
  aligned(
    input.relativeBearingDegrees,
    input.radialFetchesM,
    "relativeBearingDegrees",
  );
  if (input.relativeBearingDegrees.some((v) => v <= -90 || v >= 90))
    simpleError(
      "relativeBearingDegrees",
      "Rays must lie strictly inside ±90 degrees of wind direction.",
    );
  const weights = input.relativeBearingDegrees.map((v) =>
    Math.cos((v * Math.PI) / 180),
  );
  return {
    cosineWeightedEffectiveFetchM:
      input.radialFetchesM.reduce((s, v, i) => s + v * weights[i] ** 2, 0) /
      positive(
        weights.reduce((a, b) => a + b, 0),
        "bearings",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  relativeBearingDegrees: [-60, 0, 60],
  radialFetchesM: [100, 200, 100],
} satisfies Input;
export const exampleOutput = {
  cosineWeightedEffectiveFetchM: 125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/effective-fetch-length",
  title: "Effective Fetch Length",
  description:
    "Calculate the specified effective-fetch convention sum(F·cos²theta)/sum(cos theta) from measured radial fetches; no shoreline GIS or prevailing-wind inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "cosineWeightedEffectiveFetchM",
      label: "Cosine weighted effective fetch m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      relativeBearingDegrees: value.relativeBearingDegrees as readonly number[],
      radialFetchesM: value.radialFetchesM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
