import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly electrodeImpedance: number;
  readonly referenceImpedance: number;
  readonly suppliedLimit: number;
};
export type Output = {
  readonly ratio: number;
  readonly margin: number;
  readonly withinSuppliedLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    electrodeImpedance: { type: "number", minimum: 0 },
    referenceImpedance: { type: "number", exclusiveMinimum: 0 },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: ["electrodeImpedance", "referenceImpedance", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    margin: { type: "number" },
    withinSuppliedLimit: { type: "boolean" },
  },
  required: ["ratio", "margin", "withinSuppliedLimit"],
} as const;
/** Compare supplied electrode impedance with an explicit reference and limit; no device or patient safety threshold is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { electrodeImpedance, referenceImpedance, suppliedLimit } = request;
  const compute = (): Output => {
    H.domain(electrodeImpedance >= 0 && suppliedLimit >= 0);
    H.positive(referenceImpedance);
    return {
      ratio: electrodeImpedance / referenceImpedance,
      margin: suppliedLimit - electrodeImpedance,
      withinSuppliedLimit: electrodeImpedance <= suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { electrodeImpedance: 5, referenceImpedance: 2, suppliedLimit: 10 },
  output: { ratio: 2.5, margin: 5, withinSuppliedLimit: true },
} satisfies ToolExample<Input, Output>;
export const eegImpedanceReferenceRatioTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-impedance-reference-ratio-term",
    title: "EEG Impedance Reference Ratio Term Tool",
    description:
      "Compare supplied electrode impedance with an explicit reference and limit; no device or patient safety threshold is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        electrodeImpedance: { type: "number", minimum: 0 },
        referenceImpedance: { type: "number", exclusiveMinimum: 0 },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: ["electrodeImpedance", "referenceImpedance", "suppliedLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        margin: { type: "number" },
        withinSuppliedLimit: { type: "boolean" },
      },
      required: ["ratio", "margin", "withinSuppliedLimit"],
    },
    ports: {
      inputs: [
        {
          id: "electrodeImpedance",
          label: "Electrode Impedance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceImpedance",
          label: "Reference Impedance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "withinSuppliedLimit",
          label: "Within Supplied Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegImpedanceReferenceRatioTermTool.execute;
export default eegImpedanceReferenceRatioTermTool;
