import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly darkSignal: number; readonly rawSignal: number };
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { darkSignal: { type: "number" }, rawSignal: { type: "number" } },
  required: ["darkSignal", "rawSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract supplied radiometer dark signal from raw signal in matching calibrated units, retaining negative residuals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { darkSignal, rawSignal } = request;
  const compute = (): Output => {
    return { signedGap: rawSignal - darkSignal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { darkSignal: 12, rawSignal: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const radiometerDarkCurrentSubtractionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["atmospheric-physics", "atmospheric physics", "physics"],
        keywords: ["atmospheric physics", "physics"],
      },
      id: "atmospheric-physics/radiometer-dark-current-subtraction-term",
      title: "Radiometer Dark Current Subtraction Term",
      description:
        "Subtract supplied radiometer dark signal from raw signal in matching calibrated units, retaining negative residuals.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          darkSignal: { type: "number" },
          rawSignal: { type: "number" },
        },
        required: ["darkSignal", "rawSignal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "darkSignal",
            label: "Dark Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rawSignal",
            label: "Raw Signal",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = radiometerDarkCurrentSubtractionTermTool.execute;
export default radiometerDarkCurrentSubtractionTermTool;
