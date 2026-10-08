import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integratedCharge: number;
  readonly backgroundCharge: number;
  readonly electrodeArea: number;
};
export type Output = {
  readonly netCharge: number;
  readonly chargePerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integratedCharge: { type: "number" },
    backgroundCharge: { type: "number" },
    electrodeArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["integratedCharge", "backgroundCharge", "electrodeArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCharge: { type: "number" },
    chargePerArea: { type: "number" },
  },
  required: ["netCharge", "chargePerArea"],
} as const;
/** Subtract supplied background charge and normalize by an explicit positive electrode area without selecting surface-area calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integratedCharge, backgroundCharge, electrodeArea } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(electrodeArea) && electrodeArea > 0,
      "electrodeArea",
    ),
      electrodeArea);
    return {
      netCharge: integratedCharge - backgroundCharge,
      chargePerArea: (integratedCharge - backgroundCharge) / electrodeArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integratedCharge: 12, backgroundCharge: 2, electrodeArea: 5 },
  output: { netCharge: 10, chargePerArea: 2 },
} satisfies ToolExample<Input, Output>;
export const electrochemicalSurfaceChargeBackgroundTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/electrochemical-surface-charge-background-term",
      title: "Electrochemical Surface Charge Background Term Tool",
      description:
        "Subtract supplied background charge and normalize by an explicit positive electrode area without selecting surface-area calibration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          integratedCharge: { type: "number" },
          backgroundCharge: { type: "number" },
          electrodeArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["integratedCharge", "backgroundCharge", "electrodeArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netCharge: { type: "number" },
          chargePerArea: { type: "number" },
        },
        required: ["netCharge", "chargePerArea"],
      },
      ports: {
        inputs: [
          {
            id: "integratedCharge",
            label: "Integrated Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "backgroundCharge",
            label: "Background Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "electrodeArea",
            label: "Electrode Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netCharge",
            label: "Net Charge",
            valueType: { type: "number" },
          },
          {
            id: "chargePerArea",
            label: "Charge Per Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electrochemicalSurfaceChargeBackgroundTermTool.execute;
export default electrochemicalSurfaceChargeBackgroundTermTool;
