import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeVolume: number;
  readonly afterVolume: number;
  readonly withdrawalsDuringTopup: number;
};
export type Output = {
  readonly netChange: number;
  readonly inferredAddedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeVolume: { type: "number", minimum: 0 },
    afterVolume: { type: "number", minimum: 0 },
    withdrawalsDuringTopup: { type: "number", minimum: 0 },
  },
  required: ["beforeVolume", "afterVolume", "withdrawalsDuringTopup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netChange: { type: "number" },
    inferredAddedVolume: { type: "number" },
  },
  required: ["netChange", "inferredAddedVolume"],
} as const;
/** Calculate reservoir topup volume delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeVolume, afterVolume, withdrawalsDuringTopup } = request;
  const compute = (): Output => {
    H.domain(
      beforeVolume >= 0 &&
        afterVolume >= 0 &&
        withdrawalsDuringTopup >= 0 &&
        afterVolume - beforeVolume + withdrawalsDuringTopup >= 0,
    );
    return {
      netChange: afterVolume - beforeVolume,
      inferredAddedVolume: afterVolume - beforeVolume + withdrawalsDuringTopup,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeVolume: 10, afterVolume: 15, withdrawalsDuringTopup: 2 },
  output: { netChange: 5, inferredAddedVolume: 7 },
} satisfies ToolExample<Input, Output>;
export const reservoirTopupVolumeDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/reservoir-topup-volume-delta",
    title: "Reservoir Topup Volume Delta Tool",
    description:
      "Calculate reservoir topup volume delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeVolume: { type: "number", minimum: 0 },
        afterVolume: { type: "number", minimum: 0 },
        withdrawalsDuringTopup: { type: "number", minimum: 0 },
      },
      required: ["beforeVolume", "afterVolume", "withdrawalsDuringTopup"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netChange: { type: "number" },
        inferredAddedVolume: { type: "number" },
      },
      required: ["netChange", "inferredAddedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "beforeVolume",
          label: "Before Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterVolume",
          label: "After Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrawalsDuringTopup",
          label: "Withdrawals During Topup",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netChange", label: "Net Change", valueType: { type: "number" } },
        {
          id: "inferredAddedVolume",
          label: "Inferred Added Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservoirTopupVolumeDeltaTool.execute;
export default reservoirTopupVolumeDeltaTool;
