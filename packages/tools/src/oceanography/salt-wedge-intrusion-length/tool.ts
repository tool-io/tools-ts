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
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly upstreamDistancesM: readonly number[];
  readonly observedSalinities: readonly number[];
  readonly comparisonSalinity: number;
}>;
export type Output = Readonly<{
  readonly fittedEFoldingLengthM: number;
  readonly modelIntrusionDistanceM: number;
  readonly isBeyondObservation: boolean;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "upstreamDistancesM",
    label: "Upstream distances m",
    kind: "numberList",
  },
  {
    id: "observedSalinities",
    label: "Observed salinities",
    kind: "numberList",
  },
  { id: "comparisonSalinity", label: "Comparison salinity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSalinities.forEach((v) => positive(v, "observedSalinities"));
  positive(input.comparisonSalinity, "comparisonSalinity");
  input.upstreamDistancesM.forEach((v) => nonnegative(v, "upstreamDistancesM"));
  ordered(input.upstreamDistancesM, "upstreamDistancesM");
  const fit = regression(
    input.upstreamDistancesM,
    input.observedSalinities.map(Math.log),
  );
  if (fit.slope >= 0)
    simpleError(
      "observedSalinities",
      "Declining upstream log salinity required.",
    );
  const distance =
    (Math.log(input.comparisonSalinity) - fit.intercept) / fit.slope;
  if (distance < input.upstreamDistancesM[0])
    simpleError(
      "comparisonSalinity",
      "Comparison crossing is left of observed transect.",
    );
  return {
    fittedEFoldingLengthM: -1 / fit.slope,
    modelIntrusionDistanceM: distance,
    isBeyondObservation: distance > input.upstreamDistancesM.at(-1)!,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upstreamDistancesM: [0, 10, 20],
  observedSalinities: [10, 3.6787944117144233, 1.3533528323661268],
  comparisonSalinity: 1,
} satisfies Input;
export const exampleOutput = {
  fittedEFoldingLengthM: 10,
  modelIntrusionDistanceM: 23.02585092994046,
  isBeyondObservation: true,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/salt-wedge-intrusion-length",
  title: "Salt Wedge Intrusion Length",
  description:
    "Fit an exponential salt-intrusion profile and locate a caller salinity crossing, explicitly flagging extrapolation; not a salt-wedge hydraulics solution or freshwater-use guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedEFoldingLengthM",
      label: "Fitted e folding length m",
      kind: "number",
    },
    {
      id: "modelIntrusionDistanceM",
      label: "Model intrusion distance m",
      kind: "number",
    },
    {
      id: "isBeyondObservation",
      label: "Is beyond observation",
      kind: "boolean",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      upstreamDistancesM: value.upstreamDistancesM as readonly number[],
      observedSalinities: value.observedSalinities as readonly number[],
      comparisonSalinity: value.comparisonSalinity as number,
    }),
});
export const run = tool.execute;
export default tool;
