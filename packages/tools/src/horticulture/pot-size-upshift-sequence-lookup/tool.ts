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
  aligned,
  catalogIndex,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerPotSkuIds: readonly string[];
  readonly callerVerifiedInteriorPotLiters: readonly number[];
  readonly currentPotSkuId: string;
  readonly callerMinimumVolumeGrowthFactor: number;
  readonly callerMaximumVolumeGrowthFactor: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleNextPotSkuIds: readonly string[];
  readonly candidatePotVolumeGrowthFactors: readonly number[];
}>;
const inputFields = [
  { id: "callerPotSkuIds", label: "Caller pot sku ids", kind: "stringList" },
  {
    id: "callerVerifiedInteriorPotLiters",
    label: "Caller verified interior pot liters",
    kind: "numberList",
  },
  { id: "currentPotSkuId", label: "Current pot sku id", kind: "string" },
  {
    id: "callerMinimumVolumeGrowthFactor",
    label: "Caller minimum volume growth factor",
    kind: "number",
  },
  {
    id: "callerMaximumVolumeGrowthFactor",
    label: "Caller maximum volume growth factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedInteriorPotLiters.forEach((v) =>
    positive(v, "callerVerifiedInteriorPotLiters"),
  );
  positive(
    input.callerMinimumVolumeGrowthFactor,
    "callerMinimumVolumeGrowthFactor",
  );
  positive(
    input.callerMaximumVolumeGrowthFactor,
    "callerMaximumVolumeGrowthFactor",
  );
  aligned(
    input.callerPotSkuIds,
    input.callerVerifiedInteriorPotLiters,
    "callerPotSkuIds",
  );
  const current = catalogIndex(input.callerPotSkuIds, input.currentPotSkuId),
    growth = input.callerVerifiedInteriorPotLiters.map(
      (v) => v / input.callerVerifiedInteriorPotLiters[current],
    );
  if (
    input.callerMinimumVolumeGrowthFactor <= 1 ||
    input.callerMinimumVolumeGrowthFactor >
      input.callerMaximumVolumeGrowthFactor
  )
    simpleError("growth", "Ordered growth band above one required.");
  return {
    callerCompatibleNextPotSkuIds: input.callerPotSkuIds.filter(
      (_, i) =>
        growth[i] >= input.callerMinimumVolumeGrowthFactor &&
        growth[i] <= input.callerMaximumVolumeGrowthFactor,
    ),
    candidatePotVolumeGrowthFactors: growth,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPotSkuIds: ["a", "b", "c"],
  callerVerifiedInteriorPotLiters: [1, 2, 4],
  currentPotSkuId: "a",
  callerMinimumVolumeGrowthFactor: 1.5,
  callerMaximumVolumeGrowthFactor: 3,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleNextPotSkuIds: ["b"],
  candidatePotVolumeGrowthFactors: [1, 2, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/pot-size-upshift-sequence-lookup",
  title: "Pot Size Upshift Sequence Lookup",
  description:
    "Screen actual pot SKU measured-volume inventory under caller next-shift growth band; no universal upshift sequence, gallon-label ordering or plant/root suitability.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleNextPotSkuIds",
      label: "Caller compatible next pot sku ids",
      kind: "stringList",
    },
    {
      id: "candidatePotVolumeGrowthFactors",
      label: "Candidate pot volume growth factors",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPotSkuIds: value.callerPotSkuIds as readonly string[],
      callerVerifiedInteriorPotLiters:
        value.callerVerifiedInteriorPotLiters as readonly number[],
      currentPotSkuId: value.currentPotSkuId as string,
      callerMinimumVolumeGrowthFactor:
        value.callerMinimumVolumeGrowthFactor as number,
      callerMaximumVolumeGrowthFactor:
        value.callerMaximumVolumeGrowthFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
