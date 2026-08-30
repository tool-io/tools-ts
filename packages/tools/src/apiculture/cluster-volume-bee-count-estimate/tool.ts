import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly clusterAxisDiametersCm: readonly number[];
  readonly calibratedBeesPerLiterBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly ellipsoidClusterVolumeLiters: number;
  readonly beeCountEstimateBounds: readonly number[];
}>;
const inputFields = [
  {
    id: "clusterAxisDiametersCm",
    label: "Cluster axis diameters cm",
    kind: "numberList",
  },
  {
    id: "calibratedBeesPerLiterBounds",
    label: "Calibrated bees per liter bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.clusterAxisDiametersCm.forEach((v) =>
    positive(v, "clusterAxisDiametersCm"),
  );
  input.calibratedBeesPerLiterBounds.forEach((v) =>
    positive(v, "calibratedBeesPerLiterBounds"),
  );
  if (
    input.clusterAxisDiametersCm.length !== 3 ||
    input.calibratedBeesPerLiterBounds.length !== 2 ||
    input.calibratedBeesPerLiterBounds[0] >
      input.calibratedBeesPerLiterBounds[1]
  )
    simpleError(
      "bounds",
      "Three ellipsoid axes and ordered two-bound packing calibration required.",
    );
  const ellipsoidClusterVolumeLiters =
    ((Math.PI / 6) * input.clusterAxisDiametersCm.reduce((a, b) => a * b, 1)) /
    1000;
  return {
    ellipsoidClusterVolumeLiters,
    beeCountEstimateBounds: input.calibratedBeesPerLiterBounds.map(
      (v) => v * ellipsoidClusterVolumeLiters,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  clusterAxisDiametersCm: [10, 20, 30],
  calibratedBeesPerLiterBounds: [500, 1000],
} satisfies Input;
export const exampleOutput = {
  ellipsoidClusterVolumeLiters: 3.141592653589793,
  beeCountEstimateBounds: [1570.7963267948965, 3141.592653589793],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/cluster-volume-bee-count-estimate",
  title: "Cluster Volume Bee Count Estimate",
  description:
    "Estimate bee-count bounds from measured ellipsoid cluster axes and caller packing calibration; bounds are scenarios, not confidence intervals or a swarm identity test.",
  inputs: inputFields,
  outputs: [
    {
      id: "ellipsoidClusterVolumeLiters",
      label: "Ellipsoid cluster volume liters",
      kind: "number",
    },
    {
      id: "beeCountEstimateBounds",
      label: "Bee count estimate bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      clusterAxisDiametersCm: value.clusterAxisDiametersCm as readonly number[],
      calibratedBeesPerLiterBounds:
        value.calibratedBeesPerLiterBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
