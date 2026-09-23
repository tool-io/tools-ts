import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly donorSignal: number;
  readonly leakageCoefficient: number;
  readonly measuredAcceptor: number;
};
export type Output = {
  readonly leakage: number;
  readonly correctedAcceptor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    donorSignal: { type: "number" },
    leakageCoefficient: { type: "number", minimum: 0 },
    measuredAcceptor: { type: "number" },
  },
  required: ["donorSignal", "leakageCoefficient", "measuredAcceptor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leakage: { type: "number" },
    correctedAcceptor: { type: "number" },
  },
  required: ["leakage", "correctedAcceptor"],
} as const;
/** Subtract an explicitly calibrated donor leakage term without full FRET correction or efficiency inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { donorSignal, leakageCoefficient, measuredAcceptor } = request;
  const compute = (): Output => {
    H.domain(leakageCoefficient >= 0);
    return {
      leakage: donorSignal * leakageCoefficient,
      correctedAcceptor: measuredAcceptor - donorSignal * leakageCoefficient,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { donorSignal: 100, leakageCoefficient: 0.1, measuredAcceptor: 40 },
  output: { leakage: 10, correctedAcceptor: 30 },
} satisfies ToolExample<Input, Output>;
export const fluorescenceDonorLeakageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/fluorescence-donor-leakage-term",
    title: "Fluorescence Donor Leakage Term Tool",
    description:
      "Subtract an explicitly calibrated donor leakage term without full FRET correction or efficiency inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        donorSignal: { type: "number" },
        leakageCoefficient: { type: "number", minimum: 0 },
        measuredAcceptor: { type: "number" },
      },
      required: ["donorSignal", "leakageCoefficient", "measuredAcceptor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leakage: { type: "number" },
        correctedAcceptor: { type: "number" },
      },
      required: ["leakage", "correctedAcceptor"],
    },
    ports: {
      inputs: [
        {
          id: "donorSignal",
          label: "Donor Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leakageCoefficient",
          label: "Leakage Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredAcceptor",
          label: "Measured Acceptor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leakage", label: "Leakage", valueType: { type: "number" } },
        {
          id: "correctedAcceptor",
          label: "Corrected Acceptor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fluorescenceDonorLeakageTermTool.execute;
export default fluorescenceDonorLeakageTermTool;
