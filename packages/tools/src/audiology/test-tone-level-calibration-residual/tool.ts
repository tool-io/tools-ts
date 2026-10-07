import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetLevel: number;
  readonly measuredLevel: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetLevel: { type: "number" },
    measuredLevel: { type: "number" },
  },
  required: ["targetLevel", "measuredLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate measured-minus-target tone level on a shared calibration unit without selecting clinical correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetLevel, measuredLevel } = request;
  const compute = (): Output => {
    return { signedGap: measuredLevel - targetLevel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetLevel: 12, measuredLevel: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const testToneLevelCalibrationResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/test-tone-level-calibration-residual",
    title: "Test Tone Level Calibration Residual",
    description:
      "Calculate measured-minus-target tone level on a shared calibration unit without selecting clinical correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetLevel: { type: "number" },
        measuredLevel: { type: "number" },
      },
      required: ["targetLevel", "measuredLevel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "targetLevel",
          label: "Target Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredLevel",
          label: "Measured Level",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = testToneLevelCalibrationResidualTool.execute;
export default testToneLevelCalibrationResidualTool;
