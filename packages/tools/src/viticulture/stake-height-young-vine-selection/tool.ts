import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  unique,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerStakeSkuIds: readonly string[];
  readonly callerStakeLengthsM: readonly number[];
  readonly callerRequiredEmbeddedDepthM: number;
  readonly observedVineSupportHeightM: number;
}>;
export type Output = Readonly<{
  readonly modeledAboveGroundStakeLengthsM: readonly number[];
  readonly callerReachCompatibleStakeSkuIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerStakeSkuIds",
    label: "Caller stake sku ids",
    kind: "stringList",
  },
  {
    id: "callerStakeLengthsM",
    label: "Caller stake lengths m",
    kind: "numberList",
  },
  {
    id: "callerRequiredEmbeddedDepthM",
    label: "Caller required embedded depth m",
    kind: "number",
  },
  {
    id: "observedVineSupportHeightM",
    label: "Observed vine support height m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerStakeLengthsM.forEach((v) => positive(v, "callerStakeLengthsM"));
  nonnegative(
    input.callerRequiredEmbeddedDepthM,
    "callerRequiredEmbeddedDepthM",
  );
  nonnegative(input.observedVineSupportHeightM, "observedVineSupportHeightM");
  aligned(
    input.callerStakeSkuIds,
    input.callerStakeLengthsM,
    "callerStakeSkuIds",
  );
  unique(input.callerStakeSkuIds, "stakes");
  if (
    input.callerStakeLengthsM.some(
      (v) => v < input.callerRequiredEmbeddedDepthM,
    )
  )
    simpleError(
      "embedment",
      "Catalog stake shorter than caller embedded depth.",
    );
  const heights = input.callerStakeLengthsM.map(
    (v) => v - input.callerRequiredEmbeddedDepthM,
  );
  return {
    modeledAboveGroundStakeLengthsM: heights,
    callerReachCompatibleStakeSkuIds: input.callerStakeSkuIds.filter(
      (_, i) => heights[i] >= input.observedVineSupportHeightM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerStakeSkuIds: ["a", "b", "c"],
  callerStakeLengthsM: [1, 1.5, 2],
  callerRequiredEmbeddedDepthM: 0.5,
  observedVineSupportHeightM: 0.8,
} satisfies Input;
export const exampleOutput = {
  modeledAboveGroundStakeLengthsM: [0.5, 1, 1.5],
  callerReachCompatibleStakeSkuIds: ["b", "c"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/stake-height-young-vine-selection",
  title: "Stake Height Young Vine Selection Lookup",
  description:
    "Screen actual stake length inventory after caller independently established embedment against measured required reach; no universal young-vine stake height, anchoring/load capacity or construction safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledAboveGroundStakeLengthsM",
      label: "Modeled above ground stake lengths m",
      kind: "numberList",
    },
    {
      id: "callerReachCompatibleStakeSkuIds",
      label: "Caller reach compatible stake sku ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerStakeSkuIds: value.callerStakeSkuIds as readonly string[],
      callerStakeLengthsM: value.callerStakeLengthsM as readonly number[],
      callerRequiredEmbeddedDepthM:
        value.callerRequiredEmbeddedDepthM as number,
      observedVineSupportHeightM: value.observedVineSupportHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
