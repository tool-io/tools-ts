import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly crossShoreDistancesM: readonly number[];
  readonly radiationStressesNPerM: readonly number[];
  readonly intervalWaterDepthsM: readonly number[];
  readonly waterDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{ readonly setupAnomaliesM: readonly number[] }>;
const inputFields = [
  {
    id: "crossShoreDistancesM",
    label: "Cross shore distances m",
    kind: "numberList",
  },
  {
    id: "radiationStressesNPerM",
    label: "Radiation stresses n per m",
    kind: "numberList",
  },
  {
    id: "intervalWaterDepthsM",
    label: "Interval water depths m",
    kind: "numberList",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalWaterDepthsM.forEach((v) =>
    positive(v, "intervalWaterDepthsM"),
  );
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  ordered(input.crossShoreDistancesM, "crossShoreDistancesM");
  aligned(
    input.crossShoreDistancesM,
    input.radiationStressesNPerM,
    "radiationStressesNPerM",
  );
  aligned(
    input.crossShoreDistancesM.slice(1),
    input.intervalWaterDepthsM,
    "intervalWaterDepthsM",
  );
  let eta = 0;
  const setupAnomaliesM = [0];
  input.intervalWaterDepthsM.forEach((h, i) => {
    eta -=
      (input.radiationStressesNPerM[i + 1] - input.radiationStressesNPerM[i]) /
      (input.waterDensityKgPerM3 * input.gravityMPerSecondSquared * h);
    setupAnomaliesM.push(eta);
  });
  return { setupAnomaliesM };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crossShoreDistancesM: [0, 10, 20],
  radiationStressesNPerM: [100, 80, 40],
  intervalWaterDepthsM: [2, 1],
  waterDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  setupAnomaliesM: [0, 0.001, 0.005],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/wave-setup-superelevation-surf-zone",
  title: "Wave Setup Superelevation Surf Zone",
  description:
    "Integrate steady wave-stress setup increments over supplied interval depths relative to the offshore start; neglects setup feedback on depth, currents and breaking closures.",
  inputs: inputFields,
  outputs: [
    { id: "setupAnomaliesM", label: "Setup anomalies m", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      crossShoreDistancesM: value.crossShoreDistancesM as readonly number[],
      radiationStressesNPerM: value.radiationStressesNPerM as readonly number[],
      intervalWaterDepthsM: value.intervalWaterDepthsM as readonly number[],
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
