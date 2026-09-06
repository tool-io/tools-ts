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
  linearFit,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCumulativeProducedStockGasM3: readonly number[];
  readonly observedReservoirPressuresPa: readonly number[];
  readonly observedMatchedGasZFactors: readonly number[];
  readonly callerClosedDryGasBalanceVerified: boolean;
}>;
export type Output = Readonly<{
  readonly fittedPOverZInterceptPa: number;
  readonly dryGasBalanceOriginalStockM3: number;
  readonly dryGasBalanceFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedCumulativeProducedStockGasM3",
    label: "Observed cumulative produced stock gas m3",
    kind: "numberList",
  },
  {
    id: "observedReservoirPressuresPa",
    label: "Observed reservoir pressures pa",
    kind: "numberList",
  },
  {
    id: "observedMatchedGasZFactors",
    label: "Observed matched gas z factors",
    kind: "numberList",
  },
  {
    id: "callerClosedDryGasBalanceVerified",
    label: "Caller closed dry gas balance verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedReservoirPressuresPa.forEach((v) =>
    positive(v, "observedReservoirPressuresPa"),
  );
  input.observedMatchedGasZFactors.forEach((v) =>
    positive(v, "observedMatchedGasZFactors"),
  );
  input.observedCumulativeProducedStockGasM3.forEach((v) =>
    nonnegative(v, "observedCumulativeProducedStockGasM3"),
  );
  aligned(
    input.observedCumulativeProducedStockGasM3,
    input.observedReservoirPressuresPa,
    "observedCumulativeProducedStockGasM3",
  );
  aligned(
    input.observedCumulativeProducedStockGasM3,
    input.observedMatchedGasZFactors,
    "observedCumulativeProducedStockGasM3",
  );
  if (!input.callerClosedDryGasBalanceVerified)
    simpleError(
      "balance",
      "Independent closed dry-gas constant-temperature no influx/injection branch required.",
    );
  const f = linearFit(
    input.observedCumulativeProducedStockGasM3,
    input.observedReservoirPressuresPa.map(
      (v, i) => v / input.observedMatchedGasZFactors[i],
    ),
  );
  if (f.slope >= 0)
    simpleError("decline", "Negative p/z production slope required.");
  return {
    fittedPOverZInterceptPa: f.intercept,
    dryGasBalanceOriginalStockM3: -f.intercept / f.slope,
    dryGasBalanceFitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCumulativeProducedStockGasM3: [0, 1, 2],
  observedReservoirPressuresPa: [10, 9, 8],
  observedMatchedGasZFactors: [1, 1, 1],
  callerClosedDryGasBalanceVerified: true,
} satisfies Input;
export const exampleOutput = {
  fittedPOverZInterceptPa: 10,
  dryGasBalanceOriginalStockM3: 10,
  dryGasBalanceFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/material-balance-gas",
  title: "Petroleum Material Balance Gas Calculator",
  description:
    "Fit actual dry gas p/z versus cumulative production material balance, not EOS Z inference, volumetric OGIP or a gas reserve claim. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedPOverZInterceptPa",
      label: "Fitted p over z intercept pa",
      kind: "number",
    },
    {
      id: "dryGasBalanceOriginalStockM3",
      label: "Dry gas balance original stock m3",
      kind: "number",
    },
    {
      id: "dryGasBalanceFitRSquared",
      label: "Dry gas balance fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCumulativeProducedStockGasM3:
        value.observedCumulativeProducedStockGasM3 as readonly number[],
      observedReservoirPressuresPa:
        value.observedReservoirPressuresPa as readonly number[],
      observedMatchedGasZFactors:
        value.observedMatchedGasZFactors as readonly number[],
      callerClosedDryGasBalanceVerified:
        value.callerClosedDryGasBalanceVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
