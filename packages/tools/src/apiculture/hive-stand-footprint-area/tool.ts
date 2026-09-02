import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape, finite } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedStandRectangles: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly uniqueMeasuredStandFootprintM2: number;
}>;
const inputFields = [
  {
    id: "observedStandRectangles",
    label: "Observed stand rectangles",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (shape(input.observedStandRectangles, "rectangles") !== 4)
    simpleError(
      "rectangles",
      "Actual same-planar-frame xleft, ybottom, xright, ytoprectangles.",
    );
  input.observedStandRectangles.forEach(([a, b, c, d]) => {
    if (c <= a || d <= b) simpleError("bounds", "Positive rectangle extents.");
  });
  const x = [
    ...new Set(input.observedStandRectangles.flatMap((r) => [r[0], r[2]])),
  ].sort((a, b) => a - b);
  let area = 0;
  for (let i = 0; i < x.length - 1; i++) {
    const y = input.observedStandRectangles
      .filter((r) => r[0] <= x[i] && r[2] >= x[i + 1])
      .map((r) => [r[1], r[3]])
      .sort((a, b) => a[0] - b[0]);
    let length = 0,
      hi = -Infinity;
    for (const [a, b] of y) {
      length += Math.max(0, b - Math.max(a, hi));
      hi = Math.max(hi, b);
    }
    area = finite(area + (x[i + 1] - x[i]) * length);
  }
  return { uniqueMeasuredStandFootprintM2: area };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStandRectangles: [
    [0, 0, 2, 1],
    [1, 0, 3, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  uniqueMeasuredStandFootprintM2: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/hive-stand-footprint-area",
  title: "Hive Stand Footprint Area Calculator",
  description:
    "Exact bounded union of actual axis-aligned hive-stand component footprint rectangles, overlaps counted once, not bare width×length or site spacing compliance. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniqueMeasuredStandFootprintM2",
      label: "Unique measured stand footprint m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStandRectangles:
        value.observedStandRectangles as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
