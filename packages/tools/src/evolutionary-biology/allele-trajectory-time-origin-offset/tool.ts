import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceOriginTime: number;
  readonly trajectoryTime: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceOriginTime: { type: "number" },
    trajectoryTime: { type: "number" },
  },
  required: ["referenceOriginTime", "trajectoryTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate a supplied allele-trajectory time relative to explicit origin in consistent units without interpolating frequencies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceOriginTime, trajectoryTime } = request;
  const compute = (): Output => {
    return { signedGap: trajectoryTime - referenceOriginTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceOriginTime: 12, trajectoryTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const alleleTrajectoryTimeOriginOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/allele-trajectory-time-origin-offset",
    title: "Allele Trajectory Time Origin Offset Tool",
    description:
      "Calculate a supplied allele-trajectory time relative to explicit origin in consistent units without interpolating frequencies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceOriginTime: { type: "number" },
        trajectoryTime: { type: "number" },
      },
      required: ["referenceOriginTime", "trajectoryTime"],
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
          id: "referenceOriginTime",
          label: "Reference Origin Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trajectoryTime",
          label: "Trajectory Time",
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
export const run = alleleTrajectoryTimeOriginOffsetTool.execute;
export default alleleTrajectoryTimeOriginOffsetTool;
