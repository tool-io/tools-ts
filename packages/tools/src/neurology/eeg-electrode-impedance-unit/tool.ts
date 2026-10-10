import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly impedance: number; readonly sourceUnit: string };
export type Output = { readonly ohms: number; readonly kiloohms: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impedance: { type: "number", minimum: 0 },
    sourceUnit: { type: "string", maxLength: 8192, enum: ["ohm", "kohm"] },
  },
  required: ["impedance", "sourceUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ohms: { type: "number" }, kiloohms: { type: "number" } },
  required: ["ohms", "kiloohms"],
} as const;
/** Convert an explicitly supplied EEG electrode impedance between ohms and kiloohms without setting an acceptance limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { impedance, sourceUnit } = request;
  const compute = (): Output => {
    H.domain(impedance >= 0, "impedance");
    H.domain(["ohm", "kohm"].includes(sourceUnit), "sourceUnit");
    return {
      ohms: sourceUnit === "kohm" ? impedance * 1000 : impedance,
      kiloohms: sourceUnit === "ohm" ? impedance / 1000 : impedance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { impedance: 5, sourceUnit: "kohm" },
  output: { ohms: 5000, kiloohms: 5 },
} satisfies ToolExample<Input, Output>;
export const eegElectrodeImpedanceUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/eeg-electrode-impedance-unit",
    title: "EEG Electrode Impedance Unit",
    description:
      "Convert an explicitly supplied EEG electrode impedance between ohms and kiloohms without setting an acceptance limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impedance: { type: "number", minimum: 0 },
        sourceUnit: { type: "string", maxLength: 8192, enum: ["ohm", "kohm"] },
      },
      required: ["impedance", "sourceUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ohms: { type: "number" }, kiloohms: { type: "number" } },
      required: ["ohms", "kiloohms"],
    },
    ports: {
      inputs: [
        {
          id: "impedance",
          label: "Impedance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceUnit",
          label: "Source Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "ohms", label: "Ohms", valueType: { type: "number" } },
        { id: "kiloohms", label: "Kiloohms", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eegElectrodeImpedanceUnitTool.execute;
export default eegElectrodeImpedanceUnitTool;
