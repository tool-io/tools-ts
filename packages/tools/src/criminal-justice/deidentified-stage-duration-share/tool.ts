import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stageDuration: number;
  readonly totalDuration: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stageDuration: { type: "number", minimum: 0 },
    totalDuration: { type: "number", minimum: 0 },
  },
  required: ["stageDuration", "totalDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate deidentified stage duration share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stageDuration, totalDuration } = request;
  const compute = (): Output => {
    H.domain(
      totalDuration >= 0 &&
        stageDuration >= 0 &&
        stageDuration <= totalDuration,
    );
    return {
      share: totalDuration > 0 ? stageDuration / totalDuration : 0,
      defined: totalDuration > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stageDuration: 5, totalDuration: 20 },
  output: { share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const deidentifiedStageDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/deidentified-stage-duration-share",
    title: "Deidentified Stage Duration Share Tool",
    description:
      "Calculate deidentified stage duration share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stageDuration: { type: "number", minimum: 0 },
        totalDuration: { type: "number", minimum: 0 },
      },
      required: ["stageDuration", "totalDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "stageDuration",
          label: "Stage Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalDuration",
          label: "Total Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = deidentifiedStageDurationShareTool.execute;
export default deidentifiedStageDurationShareTool;
