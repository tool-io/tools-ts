import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly direction: string };
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    direction: {
      type: "string",
      maxLength: 8192,
      enum: ["linear-to-db", "db-to-linear"],
    },
  },
  required: ["value", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Single reflectivity representation change; no averaging or rain-rate conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, direction } = request;
  const compute = (): Output => {
    H.domain(["linear-to-db", "db-to-linear"].includes(direction));
    H.domain(direction !== "linear-to-db" || value > 0);
    return {
      converted:
        direction === "linear-to-db"
          ? 10 * Math.log10(value)
          : 10 ** (value / 10),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 100, direction: "linear-to-db" },
  output: { converted: 20 },
} satisfies ToolExample<Input, Output>;
export const radarReflectivityLinearDbCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/radar-reflectivity-linear-db-crosswalk",
    title: "Radar Reflectivity Linear Db Crosswalk Tool",
    description:
      "Single reflectivity representation change; no averaging or rain-rate conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        direction: {
          type: "string",
          maxLength: 8192,
          enum: ["linear-to-db", "db-to-linear"],
        },
      },
      required: ["value", "direction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = radarReflectivityLinearDbCrosswalkTool.execute;
export default radarReflectivityLinearDbCrosswalkTool;
