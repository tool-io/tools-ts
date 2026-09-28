import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly longitude: number; readonly reference: number };
export type Output = { readonly longitude: number; readonly turn: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { longitude: { type: "number" }, reference: { type: "number" } },
  required: ["longitude", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { longitude: { type: "number" }, turn: { type: "integer" } },
  required: ["longitude", "turn"],
} as const;
/** Choose a longitude representative within a half turn of the reference, taking the eastward representative at an exact tie. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longitude, reference } = request;
  const compute = (): Output => {
    const turn = Math.floor((reference - longitude + 180) / 360);
    return { longitude: longitude + 360 * turn, turn };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { longitude: -170, reference: 170 },
  output: { longitude: 190, turn: 1 },
} satisfies ToolExample<Input, Output>;
export const longitudeSignedUnwrappedRepresentativeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/longitude-signed-unwrapped-representative",
      title: "Longitude Signed Unwrapped Representative Tool",
      description:
        "Choose a longitude representative within a half turn of the reference, taking the eastward representative at an exact tie.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          longitude: { type: "number" },
          reference: { type: "number" },
        },
        required: ["longitude", "reference"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          longitude: { type: "number" },
          turn: { type: "integer" },
        },
        required: ["longitude", "turn"],
      },
      ports: {
        inputs: [
          {
            id: "longitude",
            label: "Longitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "longitude",
            label: "Longitude",
            valueType: { type: "number" },
          },
          { id: "turn", label: "Turn", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = longitudeSignedUnwrappedRepresentativeTool.execute;
export default longitudeSignedUnwrappedRepresentativeTool;
