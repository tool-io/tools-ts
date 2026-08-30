import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly routeLifetimeDosesByChemical: readonly (readonly number[])[];
  readonly routeSlopeFactorsByChemical: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly chemicalRiskEstimates: readonly number[];
  readonly aggregateLinearRiskEstimate: number;
  readonly exceedsUnitRisk: boolean;
}>;
const inputFields = [
  {
    id: "routeLifetimeDosesByChemical",
    label: "Route lifetime doses by chemical",
    kind: "matrix",
  },
  {
    id: "routeSlopeFactorsByChemical",
    label: "Route slope factors by chemical",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.routeLifetimeDosesByChemical,
    input.routeSlopeFactorsByChemical,
    "routeLifetimeDosesByChemical",
  );
  const chemicalRiskEstimates = input.routeLifetimeDosesByChemical.map(
      (row, i) => {
        aligned(
          row,
          input.routeSlopeFactorsByChemical[i],
          "routeLifetimeDosesByChemical",
        );
        row.forEach((v) => nonnegative(v, "routeLifetimeDosesByChemical"));
        input.routeSlopeFactorsByChemical[i].forEach((v) =>
          nonnegative(v, "routeSlopeFactorsByChemical"),
        );
        return row.reduce(
          (s, v, j) => s + v * input.routeSlopeFactorsByChemical[i][j],
          0,
        );
      },
    ),
    aggregateLinearRiskEstimate = chemicalRiskEstimates.reduce(
      (a, b) => a + b,
      0,
    );
  return {
    chemicalRiskEstimates,
    aggregateLinearRiskEstimate,
    exceedsUnitRisk: aggregateLinearRiskEstimate > 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  routeLifetimeDosesByChemical: [
    [0.1, 0.2],
    [0.3, 0.1],
  ],
  routeSlopeFactorsByChemical: [
    [0.1, 0.2],
    [0.3, 0.2],
  ],
} satisfies Input;
export const exampleOutput = {
  chemicalRiskEstimates: [0.05, 0.11],
  aggregateLinearRiskEstimate: 0.16,
  exceedsUnitRisk: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/chemical-route-linear-cancer-risk-sum",
  title: "Aggregate Cancer Risk",
  description:
    "Aggregate compatible route-specific linear cancer-risk estimates across chemicals under additive low-risk screening assumptions; not independent-action probability union and not a validated high-risk probability.",
  inputs: inputFields,
  outputs: [
    {
      id: "chemicalRiskEstimates",
      label: "Chemical risk estimates",
      kind: "numberList",
    },
    {
      id: "aggregateLinearRiskEstimate",
      label: "Aggregate linear risk estimate",
      kind: "number",
    },
    { id: "exceedsUnitRisk", label: "Exceeds unit risk", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      routeLifetimeDosesByChemical:
        value.routeLifetimeDosesByChemical as readonly (readonly number[])[],
      routeSlopeFactorsByChemical:
        value.routeSlopeFactorsByChemical as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
