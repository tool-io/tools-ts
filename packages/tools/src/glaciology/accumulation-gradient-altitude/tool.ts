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
  regression,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly elevationsM: readonly number[];
  readonly accumulationsMwe: readonly number[];
  readonly queryElevationM: number;
}>;
export type Output = Readonly<{
  readonly gradientMwePer100Meters: number;
  readonly fittedAccumulationAtQueryMwe: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "elevationsM", label: "Elevations m", kind: "numberList" },
  { id: "accumulationsMwe", label: "Accumulations mwe", kind: "numberList" },
  { id: "queryElevationM", label: "Query elevation m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.accumulationsMwe.forEach((v) => nonnegative(v, "accumulationsMwe"));
  const fit = regression(input.elevationsM, input.accumulationsMwe);
  if (
    input.queryElevationM < minimum(input.elevationsM) ||
    input.queryElevationM > maximum(input.elevationsM)
  )
    simpleError(
      "queryElevationM",
      "Query inside observed altitude range required.",
    );
  return {
    gradientMwePer100Meters: fit.slope * 100,
    fittedAccumulationAtQueryMwe:
      fit.intercept + fit.slope * input.queryElevationM,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  elevationsM: [1000, 1500, 2000],
  accumulationsMwe: [1, 2, 3],
  queryElevationM: 1750,
} satisfies Input;
export const exampleOutput = {
  gradientMwePer100Meters: 0.2,
  fittedAccumulationAtQueryMwe: 2.5,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/accumulation-gradient-altitude",
  title: "Accumulation Gradient Altitude",
  description:
    "Fit an observed accumulation/altitude gradient and predict only within the measured altitude range; extrapolated precipitation climatology is not invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "gradientMwePer100Meters",
      label: "Gradient mwe per100 meters",
      kind: "number",
    },
    {
      id: "fittedAccumulationAtQueryMwe",
      label: "Fitted accumulation at query mwe",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      elevationsM: value.elevationsM as readonly number[],
      accumulationsMwe: value.accumulationsMwe as readonly number[],
      queryElevationM: value.queryElevationM as number,
    }),
});
export const run = tool.execute;
export default tool;
