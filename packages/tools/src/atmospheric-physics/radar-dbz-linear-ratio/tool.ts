import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstDbz: number; readonly secondDbz: number };
export type Output = { readonly reflectivityRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstDbz: { type: "number" }, secondDbz: { type: "number" } },
  required: ["firstDbz", "secondDbz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reflectivityRatio: { type: "number" } },
  required: ["reflectivityRatio"],
} as const;
/** Convert the difference of two dBZ reflectivity observations to a linear reflectivity ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDbz, secondDbz } = request;
  const compute = (): Output => {
    return { reflectivityRatio: 10 ** ((firstDbz - secondDbz) / 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDbz: 30, secondDbz: 20 },
  output: { reflectivityRatio: 10 },
} satisfies ToolExample<Input, Output>;
export const radarDbzLinearRatioTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["atmospheric-physics", "atmospheric physics", "physics"],
        keywords: ["atmospheric physics", "physics"],
      },
      id: "atmospheric-physics/radar-dbz-linear-ratio",
      title: "Radar Dbz Linear Ratio",
      description:
        "Convert the difference of two dBZ reflectivity observations to a linear reflectivity ratio.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstDbz: { type: "number" },
          secondDbz: { type: "number" },
        },
        required: ["firstDbz", "secondDbz"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reflectivityRatio: { type: "number" } },
        required: ["reflectivityRatio"],
      },
      ports: {
        inputs: [
          {
            id: "firstDbz",
            label: "First Dbz",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondDbz",
            label: "Second Dbz",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "reflectivityRatio",
            label: "Reflectivity Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = radarDbzLinearRatioTool.execute;
export default radarDbzLinearRatioTool;
