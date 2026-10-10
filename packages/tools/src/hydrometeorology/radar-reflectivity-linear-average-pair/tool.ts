import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstDbz: number; readonly secondDbz: number };
export type Output = { readonly meanDbz: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstDbz: { type: "number" }, secondDbz: { type: "number" } },
  required: ["firstDbz", "secondDbz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanDbz: { type: "number" } },
  required: ["meanDbz"],
} as const;
/** Average two supplied radar reflectivities with equal weight in linear Z space, then return dBZ using a stable logarithmic calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDbz, secondDbz } = request;
  const compute = (): Output => {
    return (() => {
      const high = Math.max(firstDbz, secondDbz),
        low = Math.min(firstDbz, secondDbz);
      return {
        meanDbz: high + 10 * Math.log10((1 + 10 ** ((low - high) / 10)) / 2),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDbz: 0, secondDbz: 10 },
  output: { meanDbz: 7.403626894942439 },
} satisfies ToolExample<Input, Output>;
export const radarReflectivityLinearAveragePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/radar-reflectivity-linear-average-pair",
    title: "Radar Reflectivity Linear Average Pair Tool",
    description:
      "Average two supplied radar reflectivities with equal weight in linear Z space, then return dBZ using a stable logarithmic calculation.",
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
      properties: { meanDbz: { type: "number" } },
      required: ["meanDbz"],
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
        { id: "meanDbz", label: "Mean Dbz", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = radarReflectivityLinearAveragePairTool.execute;
export default radarReflectivityLinearAveragePairTool;
