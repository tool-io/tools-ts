import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ fromDegrees: number; toDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fromDegrees", label: "From degrees", kind: "number", unit: "deg" },
  { id: "toDegrees", label: "To degrees", kind: "number", unit: "deg" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.fromDegrees, -180, 180);
  H.bounded(i.toDegrees, -180, 180);
  const a = i.fromDegrees,
    b = i.toDegrees;
  H.check(Math.abs(a - b) !== 180);
  const crosses = a * b < 0 && Math.abs(a - b) < 180;
  return H.finish({
    crossesPrimeMeridian: crosses,
    touchesPrimeMeridian: a === 0 || b === 0,
  });
};
export const example = {
  input: { fromDegrees: -10, toDegrees: 10 },
  output: {
    result: { crossesPrimeMeridian: true, touchesPrimeMeridian: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/prime-meridian-crossing-flag",
  title: "Geography: Prime Meridian Crossing Flag Tool",
  description:
    "Flag a strict prime-meridian crossing along the unique shorter longitude arc; endpoint touches are separate and exact antipodal arcs are rejected.",
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
          crossesPrimeMeridian: { type: "boolean" },
          touchesPrimeMeridian: { type: "boolean" },
        },
        required: ["crossesPrimeMeridian", "touchesPrimeMeridian"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
