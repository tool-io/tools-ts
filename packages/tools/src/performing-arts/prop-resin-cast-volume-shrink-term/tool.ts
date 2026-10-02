import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly finishedVolume: number;
  readonly linearRetention: number;
};
export type Output = {
  readonly moldVolume: number;
  readonly excessVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finishedVolume: { type: "number", minimum: 0 },
    linearRetention: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["finishedVolume", "linearRetention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moldVolume: { type: "number" },
    excessVolume: { type: "number" },
  },
  required: ["moldVolume", "excessVolume"],
} as const;
/** Uniform isotropic linear retention model; mold volume compensates its cube. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { finishedVolume, linearRetention } = request;
  const compute = (): Output => {
    H.domain(
      finishedVolume >= 0 && linearRetention > 0 && linearRetention <= 1,
    );
    return {
      moldVolume: finishedVolume / linearRetention ** 3,
      excessVolume: finishedVolume / linearRetention ** 3 - finishedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { finishedVolume: 64, linearRetention: 0.8 },
  output: { moldVolume: 124.99999999999997, excessVolume: 60.99999999999997 },
} satisfies ToolExample<Input, Output>;
export const propResinCastVolumeShrinkTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/prop-resin-cast-volume-shrink-term",
    title: "Prop Resin Cast Volume Shrink Term Tool",
    description:
      "Uniform isotropic linear retention model; mold volume compensates its cube.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finishedVolume: { type: "number", minimum: 0 },
        linearRetention: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["finishedVolume", "linearRetention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moldVolume: { type: "number" },
        excessVolume: { type: "number" },
      },
      required: ["moldVolume", "excessVolume"],
    },
    ports: {
      inputs: [
        {
          id: "finishedVolume",
          label: "Finished Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "linearRetention",
          label: "Linear Retention",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "moldVolume",
          label: "Mold Volume",
          valueType: { type: "number" },
        },
        {
          id: "excessVolume",
          label: "Excess Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = propResinCastVolumeShrinkTermTool.execute;
export default propResinCastVolumeShrinkTermTool;
