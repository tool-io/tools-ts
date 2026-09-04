import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCropTreeNeighborDistancesM: readonly number[];
  readonly callerMatchedOpenGrowthCrownRadiiM: readonly number[];
  readonly observedNeighborCrownRadiiM: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedCrownReleaseClearancesM: readonly number[];
  readonly crownSpacingDiameterRatios: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCropTreeNeighborDistancesM",
    label: "Observed crop tree neighbor distances m",
    kind: "numberList",
  },
  {
    id: "callerMatchedOpenGrowthCrownRadiiM",
    label: "Caller matched open growth crown radii m",
    kind: "numberList",
  },
  {
    id: "observedNeighborCrownRadiiM",
    label: "Observed neighbor crown radii m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCropTreeNeighborDistancesM.forEach((v) =>
    positive(v, "observedCropTreeNeighborDistancesM"),
  );
  input.callerMatchedOpenGrowthCrownRadiiM.forEach((v) =>
    positive(v, "callerMatchedOpenGrowthCrownRadiiM"),
  );
  input.observedNeighborCrownRadiiM.forEach((v) =>
    positive(v, "observedNeighborCrownRadiiM"),
  );
  aligned(
    input.observedCropTreeNeighborDistancesM,
    input.callerMatchedOpenGrowthCrownRadiiM,
    "observedCropTreeNeighborDistancesM",
  );
  aligned(
    input.observedCropTreeNeighborDistancesM,
    input.observedNeighborCrownRadiiM,
    "observedCropTreeNeighborDistancesM",
  );
  const radii = input.callerMatchedOpenGrowthCrownRadiiM.map(
    (v, i) => v + input.observedNeighborCrownRadiiM[i],
  );
  return {
    signedCrownReleaseClearancesM: radii.map(
      (v, i) => input.observedCropTreeNeighborDistancesM[i] - v,
    ),
    crownSpacingDiameterRatios: radii.map(
      (v, i) => input.observedCropTreeNeighborDistancesM[i] / v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCropTreeNeighborDistancesM: [2, 3],
  callerMatchedOpenGrowthCrownRadiiM: [1, 2],
  observedNeighborCrownRadiiM: [1, 1],
} satisfies Input;
export const exampleOutput = {
  signedCrownReleaseClearancesM: [0, 0],
  crownSpacingDiameterRatios: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/crop-tree-release-spacing-rd-ratio",
  title: "Crop Tree Release Spacing RD-Ratio Tool",
  description:
    "Audit actual crop/neighbor crown-edge clearances and center-spacing-to-summed-radii ratio, not stand relative spacing or release prescription. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCrownReleaseClearancesM",
      label: "Signed crown release clearances m",
      kind: "numberList",
    },
    {
      id: "crownSpacingDiameterRatios",
      label: "Crown spacing diameter ratios",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCropTreeNeighborDistancesM:
        value.observedCropTreeNeighborDistancesM as readonly number[],
      callerMatchedOpenGrowthCrownRadiiM:
        value.callerMatchedOpenGrowthCrownRadiiM as readonly number[],
      observedNeighborCrownRadiiM:
        value.observedNeighborCrownRadiiM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
