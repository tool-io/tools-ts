import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  linearFit,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedEarlyTestPressureDrawdownPa: readonly number[];
  readonly observedIndependentlyWithdrawnWellboreVolumeM3: readonly number[];
  readonly callerEarlyStorageDominatedBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly fittedObservedWellboreStorageM3Pa: number;
  readonly fittedWellboreVolumeOffsetM3: number;
}>;
const inputFields = [
  {
    id: "observedEarlyTestPressureDrawdownPa",
    label: "Observed early test pressure drawdown pa",
    kind: "numberList",
  },
  {
    id: "observedIndependentlyWithdrawnWellboreVolumeM3",
    label: "Observed independently withdrawn wellbore volume m3",
    kind: "numberList",
  },
  {
    id: "callerEarlyStorageDominatedBranchVerified",
    label: "Caller early storage dominated branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEarlyTestPressureDrawdownPa.forEach((v) =>
    nonnegative(v, "observedEarlyTestPressureDrawdownPa"),
  );
  input.observedIndependentlyWithdrawnWellboreVolumeM3.forEach((v) =>
    nonnegative(v, "observedIndependentlyWithdrawnWellboreVolumeM3"),
  );
  if (!input.callerEarlyStorageDominatedBranchVerified)
    simpleError(
      "branch",
      "Independent early wellbore-storage-dominated constant phase conditions required.",
    );
  const f = linearFit(
    input.observedEarlyTestPressureDrawdownPa,
    input.observedIndependentlyWithdrawnWellboreVolumeM3,
  );
  return {
    fittedObservedWellboreStorageM3Pa: f.slope,
    fittedWellboreVolumeOffsetM3: f.intercept,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEarlyTestPressureDrawdownPa: [1, 2, 3],
  observedIndependentlyWithdrawnWellboreVolumeM3: [2, 4, 6],
  callerEarlyStorageDominatedBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  fittedObservedWellboreStorageM3Pa: 2,
  fittedWellboreVolumeOffsetM3: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/well-test-storage-coefficient",
  title: "Petroleum Well Test Storage Coefficient Calculator",
  description:
    "Extract actual early wellbore storage from independently measured withdrawn volume/drawdown trace, retain signed fit evidence and offset, no reservoir compressibility or automatic regime assignment. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedObservedWellboreStorageM3Pa",
      label: "Fitted observed wellbore storage m3 pa",
      kind: "number",
    },
    {
      id: "fittedWellboreVolumeOffsetM3",
      label: "Fitted wellbore volume offset m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEarlyTestPressureDrawdownPa:
        value.observedEarlyTestPressureDrawdownPa as readonly number[],
      observedIndependentlyWithdrawnWellboreVolumeM3:
        value.observedIndependentlyWithdrawnWellboreVolumeM3 as readonly number[],
      callerEarlyStorageDominatedBranchVerified:
        value.callerEarlyStorageDominatedBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
