import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDropletDiametersMicrometers: readonly number[];
  readonly observedDropletCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly countWeightedSauterMeanMicrometers: number;
}>;
const inputFields = [
  {
    id: "observedDropletDiametersMicrometers",
    label: "Observed droplet diameters micrometers",
    kind: "numberList",
  },
  {
    id: "observedDropletCounts",
    label: "Observed droplet counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDropletDiametersMicrometers.forEach((v) =>
    positive(v, "observedDropletDiametersMicrometers"),
  );
  input.observedDropletCounts.forEach((v) =>
    nonnegative(v, "observedDropletCounts"),
  );
  aligned(
    input.observedDropletDiametersMicrometers,
    input.observedDropletCounts,
    "observedDropletDiametersMicrometers",
  );
  input.observedDropletCounts.forEach((v) => integer(v, "droplets"));
  const d = sum(
    input.observedDropletDiametersMicrometers.map(
      (v, i) => v * v * input.observedDropletCounts[i],
    ),
  );
  positive(d, "counted surface evidence");
  return {
    countWeightedSauterMeanMicrometers:
      sum(
        input.observedDropletDiametersMicrometers.map(
          (v, i) => v ** 3 * input.observedDropletCounts[i],
        ),
      ) / d,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDropletDiametersMicrometers: [10, 20, 30],
  observedDropletCounts: [2, 1, 1],
} satisfies Input;
export const exampleOutput = {
  countWeightedSauterMeanMicrometers: 24.666666666666668,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/spray-droplet-size",
  title: "Agriculture Spray Droplet Size Calculator",
  description:
    "Measured count-binned SauterD32=sum(n d³)/sum(n d²), not nozzle orifice/VMD nor drift/equipment recommendation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "countWeightedSauterMeanMicrometers",
      label: "Count weighted sauter mean micrometers",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDropletDiametersMicrometers:
        value.observedDropletDiametersMicrometers as readonly number[],
      observedDropletCounts: value.observedDropletCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
