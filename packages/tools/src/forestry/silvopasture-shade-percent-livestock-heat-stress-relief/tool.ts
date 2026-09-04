import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedShadeAreaFractions: readonly number[];
  readonly observedSunTemperatureC: readonly number[];
  readonly observedShadeTemperatureC: readonly number[];
  readonly callerMatchedLivestockTemperatureReferenceC: number;
}>;
export type Output = Readonly<{
  readonly areaWeightedObservedTemperatureC: readonly number[];
  readonly signedObservedTemperatureExcessC: readonly number[];
}>;
const inputFields = [
  {
    id: "observedShadeAreaFractions",
    label: "Observed shade area fractions",
    kind: "numberList",
  },
  {
    id: "observedSunTemperatureC",
    label: "Observed sun temperature c",
    kind: "numberList",
  },
  {
    id: "observedShadeTemperatureC",
    label: "Observed shade temperature c",
    kind: "numberList",
  },
  {
    id: "callerMatchedLivestockTemperatureReferenceC",
    label: "Caller matched livestock temperature reference c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedShadeAreaFractions.forEach((v) =>
    fraction(v, "observedShadeAreaFractions"),
  );
  aligned(
    input.observedShadeAreaFractions,
    input.observedSunTemperatureC,
    "observedShadeAreaFractions",
  );
  aligned(
    input.observedShadeAreaFractions,
    input.observedShadeTemperatureC,
    "observedShadeAreaFractions",
  );
  const mean = input.observedShadeAreaFractions.map(
    (v, i) =>
      v * input.observedShadeTemperatureC[i] +
      (1 - v) * input.observedSunTemperatureC[i],
  );
  return {
    areaWeightedObservedTemperatureC: mean,
    signedObservedTemperatureExcessC: mean.map(
      (v) => v - input.callerMatchedLivestockTemperatureReferenceC,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShadeAreaFractions: [0.2, 0.5],
  observedSunTemperatureC: [30, 32],
  observedShadeTemperatureC: [25, 28],
  callerMatchedLivestockTemperatureReferenceC: 29,
} satisfies Input;
export const exampleOutput = {
  areaWeightedObservedTemperatureC: [29, 30],
  signedObservedTemperatureExcessC: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/silvopasture-shade-percent-livestock-heat-stress-relief",
  title: "Silvopasture Shade Percent Heat Stress Relief",
  description:
    "Audit observed silvopasture shade-area and independently measured sun/shade temperatures, not shade removal stream warming, physiological livestock heat-stress index or heat relief efficacy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaWeightedObservedTemperatureC",
      label: "Area weighted observed temperature c",
      kind: "numberList",
    },
    {
      id: "signedObservedTemperatureExcessC",
      label: "Signed observed temperature excess c",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShadeAreaFractions:
        value.observedShadeAreaFractions as readonly number[],
      observedSunTemperatureC:
        value.observedSunTemperatureC as readonly number[],
      observedShadeTemperatureC:
        value.observedShadeTemperatureC as readonly number[],
      callerMatchedLivestockTemperatureReferenceC:
        value.callerMatchedLivestockTemperatureReferenceC as number,
    }),
});
export const run = tool.execute;
export default tool;
