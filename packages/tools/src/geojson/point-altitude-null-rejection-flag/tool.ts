import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  parseJson,
  list,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly coordinatesJson: string };
export type Output = { readonly valid: boolean; readonly hasAltitude: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinatesJson: { type: "string", maxLength: 8192 } },
  required: ["coordinatesJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, hasAltitude: { type: "boolean" } },
  required: ["valid", "hasAltitude"],
} as const;
/** Compute point altitude null rejection flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { coordinatesJson } = input;
  const compute = (): Output => {
    const a = list(parseJson(coordinatesJson));
    return {
      valid:
        a.length >= 2 &&
        a.every((x) => typeof x === "number" && Number.isFinite(x)),
      hasAltitude: a.length >= 3,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinatesJson: "[10,20,null]" },
  output: { valid: false, hasAltitude: true },
} satisfies ToolExample<Input, Output>;
export const pointAltitudeNullRejectionFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geojson/point-altitude-null-rejection-flag",
  title: "Point Altitude Null Rejection Flag Tool",
  description:
    "Compute point altitude null rejection flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "coordinatesJson",
        label: "Coordinates Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      {
        id: "hasAltitude",
        label: "Has Altitude",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = pointAltitudeNullRejectionFlagTool.execute;
export default pointAltitudeNullRejectionFlagTool;
