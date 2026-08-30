import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, minimum } from "../shared.js";

export type Input = Readonly<{ readonly layerReport: string }>;
export type Output = Readonly<{
  readonly layerCoverOktasLowerBounds: readonly number[];
  readonly layerBaseHeightsFeet: readonly number[];
  readonly observedCeilingFound: boolean;
  readonly firstLowestCeilingFeet: number;
  readonly hasVerticalVisibilityLayer: boolean;
}>;
const inputFields = [
  { id: "layerReport", label: "Layer report", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const text = input.layerReport.trim();
  if (text === "CLR" || text === "SKC")
    return {
      layerCoverOktasLowerBounds: [],
      layerBaseHeightsFeet: [],
      observedCeilingFound: false,
      firstLowestCeilingFeet: -1,
      hasVerticalVisibilityLayer: false,
    };
  const tokens = text.split(/\s+/);
  if (tokens.length < 1 || tokens.length > 16)
    simpleError(
      "layerReport",
      "One to sixteen explicit cloud-layer tokens required.",
    );
  const covers: number[] = [],
    heights: number[] = [],
    ceilings: number[] = [];
  let vv = false;
  for (const token of tokens) {
    const m = /^(FEW|SCT|BKN|OVC|VV)(\d{3})$/.exec(token);
    if (!m)
      return simpleError(
        "layerReport",
        "Strict FEW/SCT/BKN/OVC/VV plus three hundreds-of-feet digits required; unknown heights and full METAR text unsupported.",
      );
    const h = Number(m[2]) * 100,
      c = m[1];
    covers.push(c === "FEW" ? 1 : c === "SCT" ? 3 : c === "BKN" ? 5 : 8);
    heights.push(h);
    if (c === "BKN" || c === "OVC" || c === "VV") ceilings.push(h);
    if (c === "VV") vv = true;
  }
  if (vv && tokens.length !== 1)
    simpleError(
      "layerReport",
      "Vertical visibility must stand alone; do not report it as an additional resolved cloud layer.",
    );
  if (heights.some((h, i) => i > 0 && h < heights[i - 1]))
    simpleError(
      "layerReport",
      "Observed layer bases in nondecreasing order required.",
    );
  return {
    layerCoverOktasLowerBounds: covers,
    layerBaseHeightsFeet: heights,
    observedCeilingFound: ceilings.length > 0,
    firstLowestCeilingFeet: ceilings.length ? minimum(ceilings) : -1,
    hasVerticalVisibilityLayer: vv,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerReport: "FEW020 SCT035 BKN100",
} satisfies Input;
export const exampleOutput = {
  layerCoverOktasLowerBounds: [1, 3, 5],
  layerBaseHeightsFeet: [2000, 3500, 10000],
  observedCeilingFound: true,
  firstLowestCeilingFeet: 10000,
  hasVerticalVisibilityLayer: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/ceilometer-cloud-layer-report-parser",
  title: "Ceilometer Cloud Layer Report Parser",
  description:
    "Parse strict operational cloud-layer subset (FEW/SCT/BKN/OVC/VV with known three-digit heights in hundreds of feet); CLR/SKC retain no observed ceiling, no full METAR/unknown-height inference or aviation minima/safe-flight assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerCoverOktasLowerBounds",
      label: "Layer cover oktas lower bounds",
      kind: "numberList",
    },
    {
      id: "layerBaseHeightsFeet",
      label: "Layer base heights feet",
      kind: "numberList",
    },
    {
      id: "observedCeilingFound",
      label: "Observed ceiling found",
      kind: "boolean",
    },
    {
      id: "firstLowestCeilingFeet",
      label: "First lowest ceiling feet",
      kind: "number",
    },
    {
      id: "hasVerticalVisibilityLayer",
      label: "Has vertical visibility layer",
      kind: "boolean",
    },
  ],
  calculate: (value) => calculate({ layerReport: value.layerReport as string }),
});
export const run = tool.execute;
export default tool;
