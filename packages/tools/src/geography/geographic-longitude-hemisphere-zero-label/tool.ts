import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly magnitude: number; readonly west: boolean };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number", minimum: 0, maximum: 180 },
    west: { type: "boolean" },
  },
  required: ["magnitude", "west"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate geographic longitude hemisphere zero label from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { magnitude, west } = input;
  const compute = (): Output => {
    H.domain(magnitude >= 0 && magnitude <= 180);
    return { text: magnitude + "°" + (west ? "W" : "E") };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { magnitude: 0, west: true },
  output: { text: "0°W" },
} satisfies ToolExample<Input, Output>;
export const geographicLongitudeHemisphereZeroLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/geographic-longitude-hemisphere-zero-label",
      title: "Geographic Longitude Hemisphere Zero Label Tool",
      description:
        "Calculate geographic longitude hemisphere zero label from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          magnitude: { type: "number", minimum: 0, maximum: 180 },
          west: { type: "boolean" },
        },
        required: ["magnitude", "west"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string", maxLength: 8192 } },
        required: ["text"],
      },
      ports: {
        inputs: [
          {
            id: "magnitude",
            label: "Magnitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "west",
            label: "West",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = geographicLongitudeHemisphereZeroLabelTool.execute;
export default geographicLongitudeHemisphereZeroLabelTool;
