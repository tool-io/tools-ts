import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  catalogIndex,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerTreeSpecIds: readonly string[];
  readonly callerRootBallMinimumDiameterCm: readonly number[];
  readonly callerRootBallMinimumDepthCm: readonly number[];
  readonly queryTreeSpecId: string;
  readonly observedBallDiameterCm: number;
  readonly observedBallDepthCm: number;
}>;
export type Output = Readonly<{
  readonly signedRootBallDiameterMarginCm: number;
  readonly signedRootBallDepthMarginCm: number;
  readonly meetsBothCallerBallDimensions: boolean;
}>;
const inputFields = [
  {
    id: "callerTreeSpecIds",
    label: "Caller tree spec ids",
    kind: "stringList",
  },
  {
    id: "callerRootBallMinimumDiameterCm",
    label: "Caller root ball minimum diameter cm",
    kind: "numberList",
  },
  {
    id: "callerRootBallMinimumDepthCm",
    label: "Caller root ball minimum depth cm",
    kind: "numberList",
  },
  { id: "queryTreeSpecId", label: "Query tree spec id", kind: "string" },
  {
    id: "observedBallDiameterCm",
    label: "Observed ball diameter cm",
    kind: "number",
  },
  {
    id: "observedBallDepthCm",
    label: "Observed ball depth cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRootBallMinimumDiameterCm.forEach((v) =>
    positive(v, "callerRootBallMinimumDiameterCm"),
  );
  input.callerRootBallMinimumDepthCm.forEach((v) =>
    positive(v, "callerRootBallMinimumDepthCm"),
  );
  positive(input.observedBallDiameterCm, "observedBallDiameterCm");
  positive(input.observedBallDepthCm, "observedBallDepthCm");
  aligned(
    input.callerTreeSpecIds,
    input.callerRootBallMinimumDiameterCm,
    "callerTreeSpecIds",
  );
  aligned(
    input.callerTreeSpecIds,
    input.callerRootBallMinimumDepthCm,
    "callerTreeSpecIds",
  );
  const i = catalogIndex(input.callerTreeSpecIds, input.queryTreeSpecId),
    d = input.observedBallDiameterCm - input.callerRootBallMinimumDiameterCm[i],
    h = input.observedBallDepthCm - input.callerRootBallMinimumDepthCm[i];
  return {
    signedRootBallDiameterMarginCm: d,
    signedRootBallDepthMarginCm: h,
    meetsBothCallerBallDimensions: d >= 0 && h >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTreeSpecIds: ["a", "b"],
  callerRootBallMinimumDiameterCm: [40, 50],
  callerRootBallMinimumDepthCm: [30, 40],
  queryTreeSpecId: "a",
  observedBallDiameterCm: 42,
  observedBallDepthCm: 29,
} satisfies Input;
export const exampleOutput = {
  signedRootBallDiameterMarginCm: 2,
  signedRootBallDepthMarginCm: -1,
  meetsBothCallerBallDimensions: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/balled-burlap-ball-diameter-spec-lookup",
  title: "Balled Burlap Ball Diameter Spec Lookup",
  description:
    "Audit actual balled/burlapped root-ball diameter and depth against exact caller tree specification; no invented nursery standards, root integrity, lifting safety or transplant viability.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRootBallDiameterMarginCm",
      label: "Signed root ball diameter margin cm",
      kind: "number",
    },
    {
      id: "signedRootBallDepthMarginCm",
      label: "Signed root ball depth margin cm",
      kind: "number",
    },
    {
      id: "meetsBothCallerBallDimensions",
      label: "Meets both caller ball dimensions",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTreeSpecIds: value.callerTreeSpecIds as readonly string[],
      callerRootBallMinimumDiameterCm:
        value.callerRootBallMinimumDiameterCm as readonly number[],
      callerRootBallMinimumDepthCm:
        value.callerRootBallMinimumDepthCm as readonly number[],
      queryTreeSpecId: value.queryTreeSpecId as string,
      observedBallDiameterCm: value.observedBallDiameterCm as number,
      observedBallDepthCm: value.observedBallDepthCm as number,
    }),
});
export const run = tool.execute;
export default tool;
