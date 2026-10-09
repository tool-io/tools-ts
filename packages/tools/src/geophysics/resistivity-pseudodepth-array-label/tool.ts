import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurementId: string;
  readonly arrayConfiguration: string;
  readonly pseudodepthConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementId: { type: "string", maxLength: 8192, minLength: 1 },
    arrayConfiguration: { type: "string", maxLength: 8192, minLength: 1 },
    pseudodepthConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["measurementId", "arrayConfiguration", "pseudodepthConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit electrical-array and pseudodepth-convention metadata without equating pseudodepth with investigation depth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurementId, arrayConfiguration, pseudodepthConvention } = request;
  const compute = (): Output => {
    H.domain(measurementId.length > 0, "measurementId");
    H.domain(arrayConfiguration.length > 0, "arrayConfiguration");
    H.domain(pseudodepthConvention.length > 0, "pseudodepthConvention");
    return {
      token: JSON.stringify([
        measurementId,
        arrayConfiguration,
        pseudodepthConvention,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measurementId: "M17",
    arrayConfiguration: "Wenner",
    pseudodepthConvention: "source P4",
  },
  output: { token: '["M17","Wenner","source P4"]' },
} satisfies ToolExample<Input, Output>;
export const resistivityPseudodepthArrayLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/resistivity-pseudodepth-array-label",
    title: "Resistivity Pseudodepth Array Label Tool",
    description:
      "Preserve explicit electrical-array and pseudodepth-convention metadata without equating pseudodepth with investigation depth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measurementId: { type: "string", maxLength: 8192, minLength: 1 },
        arrayConfiguration: { type: "string", maxLength: 8192, minLength: 1 },
        pseudodepthConvention: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: [
        "measurementId",
        "arrayConfiguration",
        "pseudodepthConvention",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "measurementId",
          label: "Measurement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "arrayConfiguration",
          label: "Array Configuration",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pseudodepthConvention",
          label: "Pseudodepth Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = resistivityPseudodepthArrayLabelTool.execute;
export default resistivityPseudodepthArrayLabelTool;
