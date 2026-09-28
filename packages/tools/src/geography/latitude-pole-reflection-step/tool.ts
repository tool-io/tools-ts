import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  latitudeDegrees: number;
  longitudeDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "longitudeDegrees",
    label: "Longitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.latitudeDegrees, -270, 270);
  H.bounded(i.longitudeDegrees, -180, 180);
  const reflected = Math.abs(i.latitudeDegrees) > 90,
    lat =
      i.latitudeDegrees > 90
        ? 180 - i.latitudeDegrees
        : i.latitudeDegrees < -90
          ? -180 - i.latitudeDegrees
          : i.latitudeDegrees;
  return H.finish({
    latitudeDegrees: lat,
    longitudeDegrees:
      H.mod(i.longitudeDegrees + (reflected ? 180 : 0) + 180, 360) - 180,
    poleReflected: reflected,
  });
};
export const example = {
  input: { latitudeDegrees: 100, longitudeDegrees: 10 },
  output: {
    result: {
      latitudeDegrees: 80,
      longitudeDegrees: -170,
      poleReflected: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/latitude-pole-reflection-step",
  title: "Geography: Latitude Pole Reflection Step Tool",
  description:
    "Normalize a single pole-crossing latitude in [-270,270] by reflection and a corresponding180-degree longitude shift; no geodesic integration.",
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
          poleReflected: { type: "boolean" },
        },
        required: ["latitudeDegrees", "longitudeDegrees", "poleReflected"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
