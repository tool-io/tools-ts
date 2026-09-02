import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  shape,
  finite,
  polygonArea,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedArtifactPlanarCoordinatesMeters: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly observedScatterConvexHullAreaM2: number;
  readonly hullVertexCoordinatesMeters: readonly (readonly number[])[];
}>;
const inputFields = [
  {
    id: "observedArtifactPlanarCoordinatesMeters",
    label: "Observed artifact planar coordinates meters",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.observedArtifactPlanarCoordinatesMeters.length < 3 ||
    shape(input.observedArtifactPlanarCoordinatesMeters, "scatter") !== 2
  )
    simpleError("points", "At least 3localplanarpointmeasurements.");
  const p = [...input.observedArtifactPlanarCoordinatesMeters].sort(
      (a, b) => a[0] - b[0] || a[1] - b[1],
    ),
    cross = (
      a: readonly number[],
      b: readonly number[],
      c: readonly number[],
    ) => finite((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])),
    chain = (pts: readonly (readonly number[])[]) => {
      const h: (readonly number[])[] = [];
      for (const v of pts) {
        while (h.length > 1 && cross(h[h.length - 2], h[h.length - 1], v) <= 0)
          h.pop();
        h.push(v);
      }
      return h;
    };
  const l = chain(p),
    u = chain([...p].reverse());
  const h = [...l.slice(0, -1), ...u.slice(0, -1)];
  if (h.length < 3)
    simpleError("hull", "Noncollinear observed scatter required.");
  return {
    observedScatterConvexHullAreaM2: polygonArea(h),
    hullVertexCoordinatesMeters: h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedArtifactPlanarCoordinatesMeters: [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
    [1, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  observedScatterConvexHullAreaM2: 4,
  hullVertexCoordinatesMeters: [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/site-size-from-artifact-scatter",
  title: "Site Size From Artifact Scatter Calculator",
  description:
    "Observed artifact scatter convex hull area, not occupied settlement boundary or sample recovery completeness; local planar coordinates only. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedScatterConvexHullAreaM2",
      label: "Observed scatter convex hull area m2",
      kind: "number",
    },
    {
      id: "hullVertexCoordinatesMeters",
      label: "Hull vertex coordinates meters",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      observedArtifactPlanarCoordinatesMeters:
        value.observedArtifactPlanarCoordinatesMeters as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
