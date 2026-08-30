import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly administeredRouteDosesMgPerKg: readonly number[];
  readonly routeAbsorptionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly absorbedRouteDosesMgPerKg: readonly number[];
  readonly aggregateAbsorbedDoseMgPerKg: number;
}>;
const inputFields = [
  {
    id: "administeredRouteDosesMgPerKg",
    label: "Administered route doses mg per kg",
    kind: "numberList",
    unit: "kg",
  },
  {
    id: "routeAbsorptionFractions",
    label: "Route absorption fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.administeredRouteDosesMgPerKg,
    input.routeAbsorptionFractions,
    "administeredRouteDosesMgPerKg",
  );
  input.administeredRouteDosesMgPerKg.forEach((v) =>
    nonnegative(v, "administeredRouteDosesMgPerKg"),
  );
  input.routeAbsorptionFractions.forEach((v) =>
    fraction(v, "routeAbsorptionFractions"),
  );
  const absorbedRouteDosesMgPerKg = input.administeredRouteDosesMgPerKg.map(
    (v, i) => v * input.routeAbsorptionFractions[i],
  );
  return {
    absorbedRouteDosesMgPerKg,
    aggregateAbsorbedDoseMgPerKg: absorbedRouteDosesMgPerKg.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  administeredRouteDosesMgPerKg: [1, 2, 3],
  routeAbsorptionFractions: [0.5, 0.2, 0.1],
} satisfies Input;
export const exampleOutput = {
  absorbedRouteDosesMgPerKg: [0.5, 0.4, 0.3],
  aggregateAbsorbedDoseMgPerKg: 1.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/route-absorption-aggregate-dose",
  title: "Aggregate Exposure",
  description:
    "Aggregate exposure to the same substance across routes on an absorbed-dose basis using caller fractions; systemic kinetics and route-specific local toxicity are not equivalent.",
  inputs: inputFields,
  outputs: [
    {
      id: "absorbedRouteDosesMgPerKg",
      label: "Absorbed route doses mg per kg",
      kind: "numberList",
      unit: "kg",
    },
    {
      id: "aggregateAbsorbedDoseMgPerKg",
      label: "Aggregate absorbed dose mg per kg",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (value) =>
    calculate({
      administeredRouteDosesMgPerKg:
        value.administeredRouteDosesMgPerKg as readonly number[],
      routeAbsorptionFractions:
        value.routeAbsorptionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
