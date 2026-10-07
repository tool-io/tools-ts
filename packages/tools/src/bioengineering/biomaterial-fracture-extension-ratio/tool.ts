import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly extensionAtFracture: number;
  readonly initialGaugeLength: number;
};
export type Output = { readonly extensionRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extensionAtFracture: { type: "number", minimum: 0 },
    initialGaugeLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["extensionAtFracture", "initialGaugeLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { extensionRatio: { type: "number" } },
  required: ["extensionRatio"],
} as const;
/** Divide supplied fracture extension by positive initial gauge length without interpreting material suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { extensionAtFracture, initialGaugeLength } = request;
  const compute = (): Output => {
    H.domain(extensionAtFracture >= 0, "extensionAtFracture");
    (H.domain(
      Number.isFinite(initialGaugeLength) && initialGaugeLength > 0,
      "initialGaugeLength",
    ),
      initialGaugeLength);
    return { extensionRatio: extensionAtFracture / initialGaugeLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { extensionAtFracture: 5, initialGaugeLength: 20 },
  output: { extensionRatio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const biomaterialFractureExtensionRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/biomaterial-fracture-extension-ratio",
    title: "Biomaterial Fracture Extension Ratio",
    description:
      "Divide supplied fracture extension by positive initial gauge length without interpreting material suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extensionAtFracture: { type: "number", minimum: 0 },
        initialGaugeLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["extensionAtFracture", "initialGaugeLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { extensionRatio: { type: "number" } },
      required: ["extensionRatio"],
    },
    ports: {
      inputs: [
        {
          id: "extensionAtFracture",
          label: "Extension At Fracture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialGaugeLength",
          label: "Initial Gauge Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "extensionRatio",
          label: "Extension Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomaterialFractureExtensionRatioTool.execute;
export default biomaterialFractureExtensionRatioTool;
