import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receiverSpacing: number;
  readonly maximumFrequency: number;
  readonly signedSlowness: number;
};
export type Output = {
  readonly maximumUnaliasedSlowness: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receiverSpacing: { type: "number", exclusiveMinimum: 0 },
    maximumFrequency: { type: "number", exclusiveMinimum: 0 },
    signedSlowness: { type: "number" },
  },
  required: ["receiverSpacing", "maximumFrequency", "signedSlowness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumUnaliasedSlowness: { type: "number" },
    margin: { type: "number" },
  },
  required: ["maximumUnaliasedSlowness", "margin"],
} as const;
/** Compare explicit plane-wave slowness with spatial Nyquist limit 1/(2*f_max*receiver_spacing) in compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { receiverSpacing, maximumFrequency, signedSlowness } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(receiverSpacing) && receiverSpacing > 0,
      "receiverSpacing",
    ),
      receiverSpacing);
    (H.domain(
      Number.isFinite(maximumFrequency) && maximumFrequency > 0,
      "maximumFrequency",
    ),
      maximumFrequency);
    return (() => {
      const maximumUnaliasedSlowness =
        1 / receiverSpacing / maximumFrequency / 2;
      return {
        maximumUnaliasedSlowness,
        margin: maximumUnaliasedSlowness - Math.abs(signedSlowness),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { receiverSpacing: 10, maximumFrequency: 5, signedSlowness: 0.008 },
  output: { maximumUnaliasedSlowness: 0.01, margin: 0.002 },
} satisfies ToolExample<Input, Output>;
export const seismicSamplingSlownessAliasMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/seismic-sampling-slowness-alias-margin",
    title: "Seismic Sampling Slowness Alias Margin Tool",
    description:
      "Compare explicit plane-wave slowness with spatial Nyquist limit 1/(2*f_max*receiver_spacing) in compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        receiverSpacing: { type: "number", exclusiveMinimum: 0 },
        maximumFrequency: { type: "number", exclusiveMinimum: 0 },
        signedSlowness: { type: "number" },
      },
      required: ["receiverSpacing", "maximumFrequency", "signedSlowness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maximumUnaliasedSlowness: { type: "number" },
        margin: { type: "number" },
      },
      required: ["maximumUnaliasedSlowness", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "receiverSpacing",
          label: "Receiver Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumFrequency",
          label: "Maximum Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedSlowness",
          label: "Signed Slowness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "maximumUnaliasedSlowness",
          label: "Maximum Unaliased Slowness",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seismicSamplingSlownessAliasMarginTool.execute;
export default seismicSamplingSlownessAliasMarginTool;
