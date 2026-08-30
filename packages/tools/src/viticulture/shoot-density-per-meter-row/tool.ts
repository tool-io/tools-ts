import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly observedShootCounts: readonly number[];
  readonly sampledRowLengthsM: readonly number[];
  readonly curtainCountsPerSample: readonly number[];
}>;
export type Output = Readonly<{
  readonly shootDensitiesPerMeterRow: readonly number[];
  readonly shootDensitiesPerMeterCurtain: readonly number[];
  readonly pooledShootDensityPerMeterCurtain: number;
}>;
const inputFields = [
  {
    id: "observedShootCounts",
    label: "Observed shoot counts",
    kind: "numberList",
  },
  {
    id: "sampledRowLengthsM",
    label: "Sampled row lengths m",
    kind: "numberList",
  },
  {
    id: "curtainCountsPerSample",
    label: "Curtain counts per sample",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampledRowLengthsM.forEach((v) => positive(v, "sampledRowLengthsM"));
  input.curtainCountsPerSample.forEach((v) =>
    positive(v, "curtainCountsPerSample"),
  );
  input.observedShootCounts.forEach((v) => count(v, "observedShootCounts"));
  input.curtainCountsPerSample.forEach((v) =>
    count(v, "curtainCountsPerSample"),
  );
  aligned(
    input.observedShootCounts,
    input.sampledRowLengthsM,
    "observedShootCounts",
  );
  aligned(
    input.observedShootCounts,
    input.curtainCountsPerSample,
    "observedShootCounts",
  );
  return {
    shootDensitiesPerMeterRow: input.observedShootCounts.map(
      (v, i) => v / input.sampledRowLengthsM[i],
    ),
    shootDensitiesPerMeterCurtain: input.observedShootCounts.map(
      (v, i) =>
        v / (input.sampledRowLengthsM[i] * input.curtainCountsPerSample[i]),
    ),
    pooledShootDensityPerMeterCurtain:
      input.observedShootCounts.reduce((a, b) => a + b, 0) /
      input.sampledRowLengthsM.reduce(
        (s, v, i) => s + v * input.curtainCountsPerSample[i],
        0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShootCounts: [10, 30],
  sampledRowLengthsM: [1, 3],
  curtainCountsPerSample: [1, 2],
} satisfies Input;
export const exampleOutput = {
  shootDensitiesPerMeterRow: [10, 10],
  shootDensitiesPerMeterCurtain: [10, 5],
  pooledShootDensityPerMeterCurtain: 5.714285714285714,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/shoot-density-per-meter-row",
  title: "Shoot Density Per Meter Row",
  description:
    "Normalize observed shoot inventories by actual row versus multiple-curtain exposure, retaining different denominators; no shoot density target or canopy quality inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "shootDensitiesPerMeterRow",
      label: "Shoot densities per meter row",
      kind: "numberList",
    },
    {
      id: "shootDensitiesPerMeterCurtain",
      label: "Shoot densities per meter curtain",
      kind: "numberList",
    },
    {
      id: "pooledShootDensityPerMeterCurtain",
      label: "Pooled shoot density per meter curtain",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShootCounts: value.observedShootCounts as readonly number[],
      sampledRowLengthsM: value.sampledRowLengthsM as readonly number[],
      curtainCountsPerSample: value.curtainCountsPerSample as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
