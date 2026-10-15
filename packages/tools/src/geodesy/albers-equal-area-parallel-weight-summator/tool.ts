import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  firstParallelDegrees: number;
  secondParallelDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "semiMajorMeters",
    label: "Semi major meters",
    kind: "number",
    unit: "m",
  },
  { id: "flattening", label: "Flattening", kind: "number" },
  {
    id: "firstParallelDegrees",
    label: "First parallel degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "secondParallelDegrees",
    label: "Second parallel degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi1 = H.latitude(i.firstParallelDegrees, false),
    phi2 = H.latitude(i.secondParallelDegrees, false),
    m1 = Math.cos(phi1) / Math.sqrt(1 - p.e2 * Math.sin(phi1) ** 2),
    m2 = Math.cos(phi2) / Math.sqrt(1 - p.e2 * Math.sin(phi2) ** 2);
  const q1 = H.authalicQ(p.f, phi1),
    q2 = H.authalicQ(p.f, phi2),
    n = phi1 === phi2 ? Math.sin(phi1) : (m1 * m1 - m2 * m2) / (q2 - q1);
  return H.finish({
    n,
    c: m1 * m1 + n * q1,
    firstParallelQ: q1,
    secondParallelQ: q2,
    degenerate: Math.abs(n) < 1e-12,
  });
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    firstParallelDegrees: 30,
    secondParallelDegrees: 30,
  },
  output: {
    result: {
      n: 0.5,
      c: 1.25,
      firstParallelQ: 1,
      secondParallelQ: 1,
      degenerate: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Albers Equal-Area Conic Projection Constants Calculator",
      "Albers Equal Area Conic Parallel Weight Summator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/albers-equal-area-parallel-weight-summator",
  title: "Albers Equal-Area Conic Projection Constants Calculator",
  description:
    "Compute Albers equal-area conic n and C from ellipsoidal parallel m/q weights, including the tangent limit and explicit zero-n degeneracy; no complete Albers coordinate transform.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          n: { type: "number" },
          c: { type: "number" },
          firstParallelQ: { type: "number" },
          secondParallelQ: { type: "number" },
          degenerate: { type: "boolean" },
        },
        required: ["n", "c", "firstParallelQ", "secondParallelQ", "degenerate"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
