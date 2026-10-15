import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ latitudeDegrees: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const phi = H.latitude(i.latitudeDegrees);
  return H.finish({
    gravityMetersPerSecondSquared:
      9.780318 *
      (1 + 0.0053024 * Math.sin(phi) ** 2 - 0.0000058 * Math.sin(2 * phi) ** 2),
    model: "International Gravity Formula 1967",
  });
};
export const example = {
  input: { latitudeDegrees: 0 },
  output: {
    result: {
      gravityMetersPerSecondSquared: 9.780318,
      model: "International Gravity Formula 1967",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "International Gravity Formula 1967 Value Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/international-gravity-formula-1967-value",
  title: "International Gravity Formula 1967 Value Calculator",
  description:
    "Evaluate the historical International Gravity Formula 1967 at sea level in m/s^2, not GRS80/WGS84 gravity or an observed anomaly.",
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
          gravityMetersPerSecondSquared: { type: "number" },
          model: { type: "string" },
        },
        required: ["gravityMetersPerSecondSquared", "model"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
