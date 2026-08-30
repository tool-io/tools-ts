import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly seasonGddCelsiusDays: number;
  readonly callerRegionLowerEdgesCelsiusDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerWinklerRegionIndex: number;
  readonly withinRegionOffsetCelsiusDays: number;
}>;
const inputFields = [
  {
    id: "seasonGddCelsiusDays",
    label: "Season gdd celsius days",
    kind: "number",
  },
  {
    id: "callerRegionLowerEdgesCelsiusDays",
    label: "Caller region lower edges celsius days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.seasonGddCelsiusDays, "seasonGddCelsiusDays");
  input.callerRegionLowerEdgesCelsiusDays.forEach((v) =>
    nonnegative(v, "callerRegionLowerEdgesCelsiusDays"),
  );
  ordered(input.callerRegionLowerEdgesCelsiusDays, "regions");
  if (input.callerRegionLowerEdgesCelsiusDays[0] !== 0)
    simpleError("regions", "Caller region bands must begin at zero.");
  let index = input.callerRegionLowerEdgesCelsiusDays.findIndex(
    (v) => v > input.seasonGddCelsiusDays,
  );
  index =
    index < 0 ? input.callerRegionLowerEdgesCelsiusDays.length - 1 : index - 1;
  return {
    callerWinklerRegionIndex: index,
    withinRegionOffsetCelsiusDays:
      input.seasonGddCelsiusDays -
      input.callerRegionLowerEdgesCelsiusDays[index],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seasonGddCelsiusDays: 1500,
  callerRegionLowerEdgesCelsiusDays: [0, 1000, 2000],
} satisfies Input;
export const exampleOutput = {
  callerWinklerRegionIndex: 1,
  withinRegionOffsetCelsiusDays: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/winkler-region-classifier",
  title: "Winkler Index GDD Region Classifier",
  description:
    "Resolve an already supplied seasonal GDD into caller Winkler-region policy bands, using lower-inclusive boundaries; no duplicate GDD accumulation, mutable region constants or crop recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerWinklerRegionIndex",
      label: "Caller winkler region index",
      kind: "number",
    },
    {
      id: "withinRegionOffsetCelsiusDays",
      label: "Within region offset celsius days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      seasonGddCelsiusDays: value.seasonGddCelsiusDays as number,
      callerRegionLowerEdgesCelsiusDays:
        value.callerRegionLowerEdgesCelsiusDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
