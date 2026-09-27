import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  southDegrees: number;
  northDegrees: number;
  westDegrees: number;
  eastDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "southDegrees", label: "South degrees", kind: "number", unit: "deg" },
  { id: "northDegrees", label: "North degrees", kind: "number", unit: "deg" },
  { id: "westDegrees", label: "West degrees", kind: "number", unit: "deg" },
  { id: "eastDegrees", label: "East degrees", kind: "number", unit: "deg" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.southDegrees, -90, 90);
  H.bounded(i.northDegrees, i.southDegrees, 90);
  H.bounded(i.westDegrees, -180, 180);
  H.bounded(i.eastDegrees, -180, 180);
  const span = H.mod(i.eastDegrees - i.westDegrees, 360);
  H.check(Math.abs(i.eastDegrees - i.westDegrees) !== 360);
  return H.finish({
    latitudeDegrees: (i.southDegrees + i.northDegrees) / 2,
    longitudeDegrees: H.mod(i.westDegrees + span / 2 + 180, 360) - 180,
  });
};
export const example = {
  input: {
    southDegrees: 0,
    northDegrees: 10,
    westDegrees: 170,
    eastDegrees: -170,
  },
  output: { result: { latitudeDegrees: 5, longitudeDegrees: -180 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/geographic-cell-angular-center",
  title: "Geography: Geographic Cell Angular Center Tool",
  description:
    "Return the angular, not area-weighted, center of a non-full eastward cell; equal longitude endpoints mean zero span and seam output is -180.",
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
          latitudeDegrees: { type: "number" },
          longitudeDegrees: { type: "number" },
        },
        required: ["latitudeDegrees", "longitudeDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
