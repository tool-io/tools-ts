import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly force: number; readonly wettedLength: number };
export type Output = { readonly tension: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number", minimum: 0 },
    wettedLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["force", "wettedLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tension: { type: "number" } },
  required: ["tension"],
} as const;
/** Convert a supplied surface force to newtons per metre using the complete effective contact length. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { force, wettedLength } = input;
  const compute = (): Output => {
    H.domain(force >= 0);
    H.positive(wettedLength);
    return { tension: force / wettedLength };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { force: 0.12, wettedLength: 2 },
  output: { tension: 0.06 },
} satisfies ToolExample<Input, Output>;
export const dynamicSurfaceTensionForcePerLengthTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/dynamic-surface-tension-force-per-length",
      title: "Dynamic Surface Tension Force Per Length Tool",
      description:
        "Convert a supplied surface force to newtons per metre using the complete effective contact length.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          force: { type: "number", minimum: 0 },
          wettedLength: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["force", "wettedLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { tension: { type: "number" } },
        required: ["tension"],
      },
      ports: {
        inputs: [
          {
            id: "force",
            label: "Force",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wettedLength",
            label: "Wetted Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "tension", label: "Tension", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = dynamicSurfaceTensionForcePerLengthTool.execute;
export default dynamicSurfaceTensionForcePerLengthTool;
