import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly noLoad: number; readonly fullLoad: number };
export type Output = { readonly gap: number; readonly regulation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noLoad: { type: "number" },
    fullLoad: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["noLoad", "fullLoad"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, regulation: { type: "number" } },
  required: ["gap", "regulation"],
} as const;
/** Calculate transformer voltage regulation signed gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noLoad, fullLoad } = request;
  const compute = (): Output => {
    H.positive(fullLoad);
    const gap = noLoad - fullLoad;
    return { gap, regulation: gap / fullLoad };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noLoad: 240, fullLoad: 230 },
  output: { gap: 10, regulation: 0.043478260869565216 },
} satisfies ToolExample<Input, Output>;
export const transformerVoltageRegulationSignedGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/transformer-voltage-regulation-signed-gap",
      title: "Transformer Voltage Regulation Signed Gap Tool",
      description:
        "Calculate transformer voltage regulation signed gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noLoad: { type: "number" },
          fullLoad: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["noLoad", "fullLoad"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { gap: { type: "number" }, regulation: { type: "number" } },
        required: ["gap", "regulation"],
      },
      ports: {
        inputs: [
          {
            id: "noLoad",
            label: "No Load",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fullLoad",
            label: "Full Load",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "gap", label: "Gap", valueType: { type: "number" } },
          {
            id: "regulation",
            label: "Regulation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = transformerVoltageRegulationSignedGapTool.execute;
export default transformerVoltageRegulationSignedGapTool;
