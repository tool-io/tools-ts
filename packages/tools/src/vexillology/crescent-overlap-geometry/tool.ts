import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly outerRadius: number;
  readonly cutoutRadius: number;
  readonly centerSeparation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "outerRadius", label: "Outer radius", kind: "number" },
  { id: "cutoutRadius", label: "Cutout radius", kind: "number" },
  { id: "centerSeparation", label: "Center separation", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.outerRadius, "outer");
  positive(input.cutoutRadius, "cutout");
  nonnegative(input.centerSeparation, "distance");
  const r = input.outerRadius,
    s = input.cutoutRadius,
    d = input.centerSeparation,
    scale = Math.max(r, s, d),
    a = r / scale,
    b = s / scale,
    c = d / scale;
  let area: number;
  if (c >= a + b) area = 0;
  else if (c <= Math.abs(a - b)) area = Math.PI * Math.min(a, b) ** 2;
  else {
    const acos = (x: number) => Math.acos(Math.max(-1, Math.min(1, x)));
    area =
      a * a * acos((c * c + a * a - b * b) / (2 * c * a)) +
      b * b * acos((c * c + b * b - a * a) / (2 * c * b)) -
      0.5 *
        Math.sqrt(
          Math.max(0, (-c + a + b) * (c + a - b) * (c - a + b) * (c + a + b)),
        );
  }
  const overlap = area * scale * scale;
  return {
    circularOverlapArea: overlap,
    remainingCrescentArea: Math.max(0, Math.PI * r * r - overlap),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { outerRadius: 10, cutoutRadius: 10, centerSeparation: 10 },
  output: {
    result: {
      circularOverlapArea: 122.83696986087567,
      remainingCrescentArea: 191.3222954981036,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/crescent-overlap-geometry",
  title: "Crescent Overlap Geometry Calculator",
  description:
    "Ideal crescent subtracting overlap of two offset discs; containment, concentricity and disjoint cases explicit, no national construction standard inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
