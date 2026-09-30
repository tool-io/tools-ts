import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstQuaternion: readonly number[];
  secondQuaternion: readonly number[];
  fraction: number;
  shortestArc: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstQuaternion", label: "First quaternion", kind: "numberList" },
  { id: "secondQuaternion", label: "Second quaternion", kind: "numberList" },
  { id: "fraction", label: "Fraction", kind: "number" },
  { id: "shortestArc", label: "Shortest arc", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.firstQuaternion.length === 4 && i.secondQuaternion.length === 4);
  for (const q of [i.firstQuaternion, i.secondQuaternion])
    H.check(Math.abs(Math.hypot(...q) - 1) <= 1e-10);
  H.bounded(i.fraction, 0, 1);
  const dot = i.firstQuaternion.reduce(
      (s, x, j) => s + x * i.secondQuaternion[j],
      0,
    ),
    flip = i.shortestArc && dot < 0,
    blend = i.firstQuaternion.map(
      (x, j) =>
        (1 - i.fraction) * x +
        i.fraction * i.secondQuaternion[j] * (flip ? -1 : 1),
    ),
    n = Math.hypot(...blend);
  H.positive(n);
  return H.finish({
    normalizationFactor: n,
    normalized: blend.map((x) => x / n),
    secondNegated: flip,
  });
};
export const example = {
  input: {
    firstQuaternion: [1, 0, 0, 0],
    secondQuaternion: [0, 1, 0, 0],
    fraction: 0.5,
    shortestArc: true,
  },
  output: {
    result: {
      normalizationFactor: 0.7071067811865476,
      normalized: [0.7071067811865476, 0.7071067811865476, 0, 0],
      secondNegated: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/quaternion-nlerp-normalization-factor",
  title: "Interpolation: Quaternion Nlerp Normalization Factor Tool",
  description:
    "Compute the raw blend norm and normalized quaternion for nlerp of explicit unit quaternions, with optional hemisphere alignment; antipodal zero blends are rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalizationFactor: { type: "number" },
          normalized: { type: "array", items: { type: "number" } },
          secondNegated: { type: "boolean" },
        },
        required: ["normalizationFactor", "normalized", "secondNegated"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
