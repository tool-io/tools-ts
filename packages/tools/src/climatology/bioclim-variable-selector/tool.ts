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
  mean,
  maximum,
  minimum,
  months,
} from "../shared.js";

export type Input = Readonly<{
  readonly monthlyMinimumTemperaturesC: readonly number[];
  readonly monthlyMaximumTemperaturesC: readonly number[];
  readonly monthlyPrecipitationMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly bioclimaticVariablesBio1ThroughBio19: readonly number[];
  readonly wettestQuarterStartMonthIndex: number;
  readonly driestQuarterStartMonthIndex: number;
  readonly warmestQuarterStartMonthIndex: number;
  readonly coldestQuarterStartMonthIndex: number;
}>;
const inputFields = [
  {
    id: "monthlyMinimumTemperaturesC",
    label: "Monthly minimum temperatures c",
    kind: "numberList",
  },
  {
    id: "monthlyMaximumTemperaturesC",
    label: "Monthly maximum temperatures c",
    kind: "numberList",
  },
  {
    id: "monthlyPrecipitationMm",
    label: "Monthly precipitation mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.monthlyPrecipitationMm.forEach((v) =>
    nonnegative(v, "monthlyPrecipitationMm"),
  );
  aligned(
    input.monthlyMinimumTemperaturesC,
    input.monthlyMaximumTemperaturesC,
    "monthlyMinimumTemperaturesC",
  );
  aligned(
    input.monthlyMinimumTemperaturesC,
    input.monthlyPrecipitationMm,
    "monthlyMinimumTemperaturesC",
  );
  months(input.monthlyMinimumTemperaturesC, "months");
  const low = input.monthlyMinimumTemperaturesC,
    high = input.monthlyMaximumTemperaturesC,
    p = input.monthlyPrecipitationMm,
    t = low.map((v, i) => {
      if (high[i] < v)
        simpleError("temperatures", "Monthly max at least min required.");
      return (v + high[i]) / 2;
    }),
    range = maximum(high) - minimum(low),
    diurnal = mean(high.map((v, i) => v - low[i]));
  positive(range, "annualTemperatureRange");
  const pm = positive(mean(p), "meanPrecipitation"),
    sd = (x: readonly number[]) =>
      Math.sqrt(x.reduce((s, v) => s + (v - mean(x)) ** 2, 0) / x.length),
    qt = t.map((_, i) => (t[i] + t[(i + 1) % 12] + t[(i + 2) % 12]) / 3),
    qp = p.map((_, i) => p[i] + p[(i + 1) % 12] + p[(i + 2) % 12]),
    wet = qp.indexOf(maximum(qp)),
    dry = qp.indexOf(minimum(qp)),
    warm = qt.indexOf(maximum(qt)),
    cold = qt.indexOf(minimum(qt));
  return {
    bioclimaticVariablesBio1ThroughBio19: [
      mean(t),
      diurnal,
      (100 * diurnal) / range,
      100 * sd(t),
      maximum(high),
      minimum(low),
      range,
      qt[wet],
      qt[dry],
      qt[warm],
      qt[cold],
      p.reduce((a, b) => a + b, 0),
      maximum(p),
      minimum(p),
      (100 * sd(p)) / pm,
      qp[wet],
      qp[dry],
      qp[warm],
      qp[cold],
    ],
    wettestQuarterStartMonthIndex: wet,
    driestQuarterStartMonthIndex: dry,
    warmestQuarterStartMonthIndex: warm,
    coldestQuarterStartMonthIndex: cold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyMinimumTemperaturesC: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  monthlyMaximumTemperaturesC: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  monthlyPrecipitationMm: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
} satisfies Input;
export const exampleOutput = {
  bioclimaticVariablesBio1ThroughBio19: [
    10, 20, 100, 0, 20, 0, 20, 10, 10, 10, 10, 120, 10, 10, 0, 30, 30, 30, 30,
  ],
  wettestQuarterStartMonthIndex: 0,
  driestQuarterStartMonthIndex: 0,
  warmestQuarterStartMonthIndex: 0,
  coldestQuarterStartMonthIndex: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/bioclim-variable-selector",
  title: "Bioclimatic Variable BIO1-BIO19 Selector",
  description:
    "Compute BIO1–BIO19 under explicit equal-month weighting/population-SD and cyclic three-month quarters, retaining first tied quarter indices; monthly climate normals only, no raster/geographic selector or WorldClim hidden +1 precipitation convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "bioclimaticVariablesBio1ThroughBio19",
      label: "Bioclimatic variables bio1 through bio19",
      kind: "numberList",
    },
    {
      id: "wettestQuarterStartMonthIndex",
      label: "Wettest quarter start month index",
      kind: "number",
    },
    {
      id: "driestQuarterStartMonthIndex",
      label: "Driest quarter start month index",
      kind: "number",
    },
    {
      id: "warmestQuarterStartMonthIndex",
      label: "Warmest quarter start month index",
      kind: "number",
    },
    {
      id: "coldestQuarterStartMonthIndex",
      label: "Coldest quarter start month index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyMinimumTemperaturesC:
        value.monthlyMinimumTemperaturesC as readonly number[],
      monthlyMaximumTemperaturesC:
        value.monthlyMaximumTemperaturesC as readonly number[],
      monthlyPrecipitationMm: value.monthlyPrecipitationMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
