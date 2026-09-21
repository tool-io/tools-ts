import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly finalVolume: number;
  readonly positiveIsSwelling: boolean;
};
export type Output = {
  readonly signedChange: number;
  readonly fractionalChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", exclusiveMinimum: 0 },
    finalVolume: { type: "number", minimum: 0 },
    positiveIsSwelling: { type: "boolean" },
  },
  required: ["initialVolume", "finalVolume", "positiveIsSwelling"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedChange: { type: "number" },
    fractionalChange: { type: "number" },
  },
  required: ["signedChange", "fractionalChange"],
} as const;
/** Orient supplied core-volume changes under an explicit shrink/swell sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, finalVolume, positiveIsSwelling } = request;
  const compute = (): Output => {
    H.positive(initialVolume);
    H.domain(finalVolume >= 0);
    return {
      signedChange:
        (finalVolume - initialVolume) * (positiveIsSwelling ? 1 : -1),
      fractionalChange:
        ((finalVolume - initialVolume) / initialVolume) *
        (positiveIsSwelling ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialVolume: 100, finalVolume: 90, positiveIsSwelling: true },
  output: { signedChange: -10, fractionalChange: -0.1 },
} satisfies ToolExample<Input, Output>;
export const soilCoreShrinkSwellPathSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-core-shrink-swell-path-sign",
    title: "Soil Core Shrink Swell Path Sign Tool",
    description:
      "Orient supplied core-volume changes under an explicit shrink/swell sign convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVolume: { type: "number", exclusiveMinimum: 0 },
        finalVolume: { type: "number", minimum: 0 },
        positiveIsSwelling: { type: "boolean" },
      },
      required: ["initialVolume", "finalVolume", "positiveIsSwelling"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedChange: { type: "number" },
        fractionalChange: { type: "number" },
      },
      required: ["signedChange", "fractionalChange"],
    },
    ports: {
      inputs: [
        {
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalVolume",
          label: "Final Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveIsSwelling",
          label: "Positive Is Swelling",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedChange",
          label: "Signed Change",
          valueType: { type: "number" },
        },
        {
          id: "fractionalChange",
          label: "Fractional Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilCoreShrinkSwellPathSignTool.execute;
export default soilCoreShrinkSwellPathSignTool;
