import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  first: number;
  second: number;
  inputOrder: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "first", label: "First", kind: "number" },
  { id: "second", label: "Second", kind: "number" },
  {
    id: "inputOrder",
    label: "Input order",
    kind: "string",
    enum: ["lat-lon", "lon-lat"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.inputOrder, ["lat-lon", "lon-lat"]);
  const lat = i.inputOrder === "lat-lon" ? i.first : i.second,
    lon = i.inputOrder === "lat-lon" ? i.second : i.first;
  H.bounded(lat, -90, 90);
  H.bounded(lon, -180, 180);
  return H.finish({
    latitudeDegrees: lat,
    longitudeDegrees: lon,
    swappedPair: [i.second, i.first],
  });
};
export const example = {
  input: { first: 10, second: 20, inputOrder: "lat-lon" },
  output: {
    result: {
      latitudeDegrees: 10,
      longitudeDegrees: 20,
      swappedPair: [20, 10],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/geographic-latlon-axis-order-swap",
  title: "Geography: Geographic Latlon Axis Order Swap Tool",
  description:
    "Validate and swap one geographic pair under an explicitly supplied latitude/longitude axis order rather than guessing from numeric ranges.",
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
          swappedPair: { type: "array", items: { type: "number" } },
        },
        required: ["latitudeDegrees", "longitudeDegrees", "swappedPair"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
