import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  anglesDegrees: readonly number[];
  precisionWeights: readonly number[];
  sphericalExcessDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "anglesDegrees",
    label: "Angles degrees",
    kind: "numberList",
    unit: "deg",
  },
  { id: "precisionWeights", label: "Precision weights", kind: "numberList" },
  {
    id: "sphericalExcessDegrees",
    label: "Spherical excess degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.anglesDegrees.length === 3 &&
      i.precisionWeights.length === 3 &&
      i.anglesDegrees.every((x) => x > 0 && x < 180) &&
      i.precisionWeights.every((x) => x > 0 && x <= 1e12) &&
      i.sphericalExcessDegrees >= 0 &&
      i.sphericalExcessDegrees <= 1,
  );
  const error =
      i.anglesDegrees.reduce((s, x) => s + x, 0) -
      180 -
      i.sphericalExcessDegrees,
    den = i.precisionWeights.reduce((s, w) => s + 1 / w, 0),
    corrections = i.precisionWeights.map((w) => -error / (w * den));
  H.check(
    i.anglesDegrees.every(
      (x, j) => x + corrections[j] > 0 && x + corrections[j] < 180,
    ),
    "The requested closure distribution does not form valid triangle angles",
  );
  return H.finish({
    closureArcseconds: error * 3600,
    correctionsArcseconds: corrections.map((x) => x * 3600),
    adjustedDegrees: i.anglesDegrees.map((x, j) => x + corrections[j]),
  });
};
export const example = {
  input: {
    anglesDegrees: [60, 60, 61],
    precisionWeights: [1, 1, 1],
    sphericalExcessDegrees: 0,
  },
  output: {
    result: {
      closureArcseconds: 3600,
      correctionsArcseconds: [-1200, -1200, -1200],
      adjustedDegrees: [
        59.666666666666664, 59.666666666666664, 60.666666666666664,
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Triangulation Triangle Closure Error Distributor", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/triangle-closure-error-distributor",
  title: "Triangulation Triangle Closure Error Distributor",
  description:
    "Distribute triangle angle-sum closure by inverse precision weights toward 180 degrees plus supplied spherical excess; adjustment arithmetic does not establish measured-angle validity or a complete network solution.",
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
          closureArcseconds: { type: "number" },
          correctionsArcseconds: { type: "array", items: { type: "number" } },
          adjustedDegrees: { type: "array", items: { type: "number" } },
        },
        required: [
          "closureArcseconds",
          "correctionsArcseconds",
          "adjustedDegrees",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
