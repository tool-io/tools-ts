import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radiancePerSteradian: number;
  readonly steradiansPerTargetUnit: number;
};
export type Output = { readonly radiancePerTargetUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radiancePerSteradian: { type: "number" },
    steradiansPerTargetUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radiancePerSteradian", "steradiansPerTargetUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radiancePerTargetUnit: { type: "number" } },
  required: ["radiancePerTargetUnit"],
} as const;
/** Change only the solid-angle denominator using a supplied steradian size for the target unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radiancePerSteradian, steradiansPerTargetUnit } = request;
  const compute = (): Output => {
    H.positive(steradiansPerTargetUnit);
    return {
      radiancePerTargetUnit: radiancePerSteradian * steradiansPerTargetUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radiancePerSteradian: 10, steradiansPerTargetUnit: 0.5 },
  output: { radiancePerTargetUnit: 5 },
} satisfies ToolExample<Input, Output>;
export const spectralRadianceSolidAngleBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/spectral-radiance-solid-angle-basis",
    title: "Spectral Radiance Solid Angle Basis Tool",
    description:
      "Change only the solid-angle denominator using a supplied steradian size for the target unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radiancePerSteradian: { type: "number" },
        steradiansPerTargetUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["radiancePerSteradian", "steradiansPerTargetUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radiancePerTargetUnit: { type: "number" } },
      required: ["radiancePerTargetUnit"],
    },
    ports: {
      inputs: [
        {
          id: "radiancePerSteradian",
          label: "Radiance Per Steradian",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "steradiansPerTargetUnit",
          label: "Steradians Per Target Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radiancePerTargetUnit",
          label: "Radiance Per Target Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = spectralRadianceSolidAngleBasisTool.execute;
export default spectralRadianceSolidAngleBasisTool;
