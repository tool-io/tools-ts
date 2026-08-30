import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned, shape } from "../shared.js";
export type Input = Readonly<{
  readonly pointLayerPresence: readonly (readonly number[])[];
  readonly representedPointAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly layerAreaCoverPercentages: readonly number[];
  readonly understoryUnionAreaCoverPercent: number;
  readonly summedLayerCoverPercent: number;
}>;
const inputFields = [
  { id: "pointLayerPresence", label: "Point layer presence", kind: "matrix" },
  {
    id: "representedPointAreasM2",
    label: "Represented point areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedPointAreasM2.forEach((v) =>
    positive(v, "representedPointAreasM2"),
  );
  const m = shape(input.pointLayerPresence, "pointLayerPresence");
  aligned(input.pointLayerPresence, input.representedPointAreasM2, "points");
  input.pointLayerPresence.forEach((row) =>
    row.forEach((v) => {
      if (v !== 0 && v !== 1)
        simpleError("presence", "Binary per-layer point presence required.");
    }),
  );
  const area = input.representedPointAreasM2.reduce((a, b) => a + b, 0),
    layerAreaCoverPercentages = Array.from(
      { length: m },
      (_, j) =>
        (100 *
          input.pointLayerPresence.reduce(
            (s, row, i) => s + row[j] * input.representedPointAreasM2[i],
            0,
          )) /
        area,
    );
  return {
    layerAreaCoverPercentages,
    understoryUnionAreaCoverPercent:
      (100 *
        input.pointLayerPresence.reduce(
          (s, row, i) =>
            s +
            (row.some((v) => v === 1) ? input.representedPointAreasM2[i] : 0),
          0,
        )) /
      area,
    summedLayerCoverPercent: layerAreaCoverPercentages.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pointLayerPresence: [
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ],
  representedPointAreasM2: [1, 2, 1, 2],
} satisfies Input;
export const exampleOutput = {
  layerAreaCoverPercentages: [50, 50],
  understoryUnionAreaCoverPercent: 66.66666666666667,
  summedLayerCoverPercent: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/understory-cover-percentage",
  title: "Understory Cover Percentage",
  description:
    "Aggregate area-weighted understory point-layer cover, preserving overlapping layer totals separately from the union; unlike an existing single canopy-area percentage, multiple cover layers are not double counted in union.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerAreaCoverPercentages",
      label: "Layer area cover percentages",
      kind: "numberList",
    },
    {
      id: "understoryUnionAreaCoverPercent",
      label: "Understory union area cover percent",
      kind: "number",
    },
    {
      id: "summedLayerCoverPercent",
      label: "Summed layer cover percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pointLayerPresence:
        value.pointLayerPresence as readonly (readonly number[])[],
      representedPointAreasM2:
        value.representedPointAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
