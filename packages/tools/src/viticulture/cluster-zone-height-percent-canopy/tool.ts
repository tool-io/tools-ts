import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly canopyBottomHeightsM: readonly number[];
  readonly canopyTopHeightsM: readonly number[];
  readonly clusterZoneBottomHeightsM: readonly number[];
  readonly clusterZoneTopHeightsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly clusterZoneMidpointPercentOfCanopyHeight: readonly number[];
  readonly clusterZoneHeightFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "canopyBottomHeightsM",
    label: "Canopy bottom heights m",
    kind: "numberList",
  },
  {
    id: "canopyTopHeightsM",
    label: "Canopy top heights m",
    kind: "numberList",
  },
  {
    id: "clusterZoneBottomHeightsM",
    label: "Cluster zone bottom heights m",
    kind: "numberList",
  },
  {
    id: "clusterZoneTopHeightsM",
    label: "Cluster zone top heights m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.canopyBottomHeightsM,
    input.canopyTopHeightsM,
    "canopyBottomHeightsM",
  );
  aligned(
    input.canopyBottomHeightsM,
    input.clusterZoneBottomHeightsM,
    "canopyBottomHeightsM",
  );
  aligned(
    input.canopyBottomHeightsM,
    input.clusterZoneTopHeightsM,
    "canopyBottomHeightsM",
  );
  const spans = input.canopyTopHeightsM.map((t, i) =>
    positive(t - input.canopyBottomHeightsM[i], "canopyHeight"),
  );
  if (
    input.clusterZoneBottomHeightsM.some(
      (v, i) =>
        v < input.canopyBottomHeightsM[i] ||
        input.clusterZoneTopHeightsM[i] < v ||
        input.clusterZoneTopHeightsM[i] > input.canopyTopHeightsM[i],
    )
  )
    simpleError(
      "zone",
      "Ordered cluster zone must lie inside measured canopy envelope.",
    );
  return {
    clusterZoneMidpointPercentOfCanopyHeight:
      input.clusterZoneBottomHeightsM.map(
        (v, i) =>
          (100 *
            ((v + input.clusterZoneTopHeightsM[i]) / 2 -
              input.canopyBottomHeightsM[i])) /
          spans[i],
      ),
    clusterZoneHeightFractions: input.clusterZoneBottomHeightsM.map(
      (v, i) => (input.clusterZoneTopHeightsM[i] - v) / spans[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  canopyBottomHeightsM: [0.5, 1],
  canopyTopHeightsM: [2.5, 3],
  clusterZoneBottomHeightsM: [1, 1.5],
  clusterZoneTopHeightsM: [2, 2],
} satisfies Input;
export const exampleOutput = {
  clusterZoneMidpointPercentOfCanopyHeight: [50, 37.5],
  clusterZoneHeightFractions: [0.5, 0.25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/cluster-zone-height-percent-canopy",
  title: "Cluster Zone Height Percent Canopy",
  description:
    "Locate measured fruit-zone midpoints and spans within independent canopy bottom/top envelope, not ground-height percentage or light microclimate inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "clusterZoneMidpointPercentOfCanopyHeight",
      label: "Cluster zone midpoint percent of canopy height",
      kind: "numberList",
    },
    {
      id: "clusterZoneHeightFractions",
      label: "Cluster zone height fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      canopyBottomHeightsM: value.canopyBottomHeightsM as readonly number[],
      canopyTopHeightsM: value.canopyTopHeightsM as readonly number[],
      clusterZoneBottomHeightsM:
        value.clusterZoneBottomHeightsM as readonly number[],
      clusterZoneTopHeightsM: value.clusterZoneTopHeightsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
