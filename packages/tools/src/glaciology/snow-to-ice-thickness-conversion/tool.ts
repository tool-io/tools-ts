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
  sum,
  density,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly snowLayerDepthsM: readonly number[];
  readonly snowLayerDensitiesKgM3: readonly number[];
  readonly targetIceDensityKgM3: number;
}>;
export type Output = Readonly<{
  readonly layerIceEquivalentThicknessesM: readonly number[];
  readonly totalIceEquivalentThicknessM: number;
}>;
const inputFields = [
  { id: "snowLayerDepthsM", label: "Snow layer depths m", kind: "numberList" },
  {
    id: "snowLayerDensitiesKgM3",
    label: "Snow layer densities kg m3",
    kind: "numberList",
  },
  {
    id: "targetIceDensityKgM3",
    label: "Target ice density kg m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.snowLayerDensitiesKgM3.forEach((v) =>
    positive(v, "snowLayerDensitiesKgM3"),
  );
  positive(input.targetIceDensityKgM3, "targetIceDensityKgM3");
  input.snowLayerDepthsM.forEach((v) => nonnegative(v, "snowLayerDepthsM"));
  aligned(
    input.snowLayerDepthsM,
    input.snowLayerDensitiesKgM3,
    "snowLayerDepthsM",
  );
  if (input.snowLayerDensitiesKgM3.some((v) => v > input.targetIceDensityKgM3))
    simpleError(
      "density",
      "Snow density must not exceed supplied compact-ice density.",
    );
  const layers = input.snowLayerDepthsM.map(
    (v, i) =>
      v * (input.snowLayerDensitiesKgM3[i] / input.targetIceDensityKgM3),
  );
  return {
    layerIceEquivalentThicknessesM: layers,
    totalIceEquivalentThicknessM: sum(layers),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  snowLayerDepthsM: [1, 2],
  snowLayerDensitiesKgM3: [300, 450],
  targetIceDensityKgM3: 900,
} satisfies Input;
export const exampleOutput = {
  layerIceEquivalentThicknessesM: [0.3333333333333333, 1],
  totalIceEquivalentThicknessM: 1.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/snow-to-ice-thickness-conversion",
  title: "Snow to Ice Thickness Conversion Calculator",
  description:
    "Conserve measured layered snow mass when compacting to supplied ice density, distinct from water equivalent; air/water inclusions and densification timing are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerIceEquivalentThicknessesM",
      label: "Layer ice equivalent thicknesses m",
      kind: "numberList",
    },
    {
      id: "totalIceEquivalentThicknessM",
      label: "Total ice equivalent thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      snowLayerDepthsM: value.snowLayerDepthsM as readonly number[],
      snowLayerDensitiesKgM3: value.snowLayerDensitiesKgM3 as readonly number[],
      targetIceDensityKgM3: value.targetIceDensityKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
