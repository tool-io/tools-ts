import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observerHeightM: number;
  readonly targetHeightM: number;
  readonly targetDistanceM: number;
  readonly obstacleDistancesM: readonly number[];
  readonly obstacleHeightsM: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observerHeightM", label: "Observer height m", kind: "number" },
  { id: "targetHeightM", label: "Target height m", kind: "number" },
  { id: "targetDistanceM", label: "Target distance m", kind: "number" },
  {
    id: "obstacleDistancesM",
    label: "Obstacle distances m",
    kind: "numberList",
  },
  { id: "obstacleHeightsM", label: "Obstacle heights m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.targetDistanceM, "target distance");
  aligned(i.obstacleDistancesM, i.obstacleHeightsM, "obstacles");
  i.obstacleDistancesM.forEach((v) => {
    if (v <= 0 || v >= i.targetDistanceM)
      simpleError("distance", "Obstacles strictly between endpoints.");
  });
  const slope = (i.targetHeightM - i.observerHeightM) / i.targetDistanceM;
  const margins = i.obstacleHeightsM.map(
    (v, j) => i.observerHeightM + slope * i.obstacleDistancesM[j] - v,
  );
  return {
    signedClearanceM: margins,
    obstructingIndices: margins.flatMap((v, j) => (v <= 0 ? [j] : [])),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    observerHeightM: 10,
    targetHeightM: 20,
    targetDistanceM: 100,
    obstacleDistancesM: [50],
    obstacleHeightsM: [16],
  },
  output: { result: { signedClearanceM: [-1], obstructingIndices: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/intervisibility-los-angle-checker",
  title: "Intervisibility Line-of-Sight Obstruction Angle Checker",
  description:
    "Planar line-of-sight height clearance, tangency counts obstructed; no Earth curvature, atmospheric refraction or radio Fresnel analysis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
