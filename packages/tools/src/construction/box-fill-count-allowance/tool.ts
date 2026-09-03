import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedConductorCounts: readonly number[];
  readonly callerEditionVolumeAllowancesCm3Each: readonly number[];
  readonly callerIndependentEquipmentAllowanceCm3: number;
  readonly observedBoxUsableVolumeCm3: number;
}>;
export type Output = Readonly<{
  readonly callerBoxFillRequiredCm3: number;
  readonly signedUsableBoxVolumeMarginCm3: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedConductorCounts",
    label: "Caller verified conductor counts",
    kind: "numberList",
  },
  {
    id: "callerEditionVolumeAllowancesCm3Each",
    label: "Caller edition volume allowances cm3 each",
    kind: "numberList",
  },
  {
    id: "callerIndependentEquipmentAllowanceCm3",
    label: "Caller independent equipment allowance cm3",
    kind: "number",
  },
  {
    id: "observedBoxUsableVolumeCm3",
    label: "Observed box usable volume cm3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedConductorCounts.forEach((v) =>
    nonnegative(v, "callerVerifiedConductorCounts"),
  );
  input.callerEditionVolumeAllowancesCm3Each.forEach((v) =>
    nonnegative(v, "callerEditionVolumeAllowancesCm3Each"),
  );
  nonnegative(
    input.callerIndependentEquipmentAllowanceCm3,
    "callerIndependentEquipmentAllowanceCm3",
  );
  nonnegative(input.observedBoxUsableVolumeCm3, "observedBoxUsableVolumeCm3");
  aligned(
    input.callerVerifiedConductorCounts,
    input.callerEditionVolumeAllowancesCm3Each,
    "callerVerifiedConductorCounts",
  );
  input.callerVerifiedConductorCounts.forEach((v) => integer(v, "counts"));
  const demand =
    sum(
      input.callerVerifiedConductorCounts.map(
        (v, i) => v * input.callerEditionVolumeAllowancesCm3Each[i],
      ),
    ) + input.callerIndependentEquipmentAllowanceCm3;
  return {
    callerBoxFillRequiredCm3: demand,
    signedUsableBoxVolumeMarginCm3: input.observedBoxUsableVolumeCm3 - demand,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedConductorCounts: [2, 3],
  callerEditionVolumeAllowancesCm3Each: [10, 20],
  callerIndependentEquipmentAllowanceCm3: 5,
  observedBoxUsableVolumeCm3: 100,
} satisfies Input;
export const exampleOutput = {
  callerBoxFillRequiredCm3: 85,
  signedUsableBoxVolumeMarginCm3: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/box-fill-count-allowance",
  title: "Box Fill Count Allowance Calculator",
  description:
    "Caller independently verified conductor/equipment counting allowances vs observed box volume, edition/ground/clamp rules external; not conduit area fraction or wiring approval. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerBoxFillRequiredCm3",
      label: "Caller box fill required cm3",
      kind: "number",
    },
    {
      id: "signedUsableBoxVolumeMarginCm3",
      label: "Signed usable box volume margin cm3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedConductorCounts:
        value.callerVerifiedConductorCounts as readonly number[],
      callerEditionVolumeAllowancesCm3Each:
        value.callerEditionVolumeAllowancesCm3Each as readonly number[],
      callerIndependentEquipmentAllowanceCm3:
        value.callerIndependentEquipmentAllowanceCm3 as number,
      observedBoxUsableVolumeCm3: value.observedBoxUsableVolumeCm3 as number,
    }),
});
export const run = tool.execute;
export default tool;
