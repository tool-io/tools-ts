import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
import { calculateEuclideanDistance } from "../euclidean-distance/tool.js";
import { linearTool } from "../../interpolation/linear/tool.js";
export type Input = Readonly<{
  vertexA: readonly number[];
  vertexB: readonly number[];
  vertexC: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "vertexA", label: "Vertex a", kind: "numberList" },
  { id: "vertexB", label: "Vertex b", kind: "numberList" },
  { id: "vertexC", label: "Vertex c", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check([i.vertexA, i.vertexB, i.vertexC].every((v) => v.length === 2));
  const ab = H.number(calculateEuclideanDistance(i.vertexA, i.vertexB)),
    ac = H.number(calculateEuclideanDistance(i.vertexA, i.vertexC));
  H.positive(ab);
  H.positive(ac);
  H.check(
    (i.vertexB[0] - i.vertexA[0]) * (i.vertexC[1] - i.vertexA[1]) !==
      (i.vertexB[1] - i.vertexA[1]) * (i.vertexC[0] - i.vertexA[0]),
  );
  return H.finish({
    foot: i.vertexB.map((start, j) => {
      const value = linearTool.execute({
        start,
        end: i.vertexC[j],
        parameter: ab / (ab + ac),
      });
      if (!value.ok) throw new Error("Linear interpolation failed");
      return H.number(value.output.value);
    }),
    oppositeSideFraction: ab / (ab + ac),
  });
};
export const example = {
  input: { vertexA: [0, 0], vertexB: [3, 0], vertexC: [0, 4] },
  output: {
    result: {
      foot: [1.7142857142857142, 1.7142857142857142],
      oppositeSideFraction: 0.42857142857142855,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/triangle-angle-bisector-foot",
  title: "Geometry: Triangle Angle Bisector Foot Tool",
  description:
    "Return the internal angle-bisector foot on BC using opposite-side division in a nondegenerate planar triangle; no external bisector or symbolic solver.",
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
          foot: { type: "array", items: { type: "number" } },
          oppositeSideFraction: { type: "number" },
        },
        required: ["foot", "oppositeSideFraction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
