import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subsampleCount: number;
  readonly totalCount: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subsampleCount: { type: "integer", minimum: 0 },
    totalCount: { type: "integer", minimum: 0 },
  },
  required: ["subsampleCount", "totalCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate insect count subsample share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subsampleCount, totalCount } = request;
  const compute = (): Output => {
    H.integer(totalCount, 0);
    H.integer(subsampleCount, 0, totalCount);
    return {
      share: totalCount > 0 ? subsampleCount / totalCount : 0,
      defined: totalCount > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subsampleCount: 12, totalCount: 40 },
  output: { share: 0.3, defined: true },
} satisfies ToolExample<Input, Output>;
export const insectCountSubsampleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-count-subsample-share",
    title: "Insect Count Subsample Share Tool",
    description:
      "Calculate insect count subsample share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subsampleCount: { type: "integer", minimum: 0 },
        totalCount: { type: "integer", minimum: 0 },
      },
      required: ["subsampleCount", "totalCount"],
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
          id: "subsampleCount",
          label: "Subsample Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalCount",
          label: "Total Count",
          required: true,
          valueType: { type: "integer" },
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
export const run = insectCountSubsampleShareTool.execute;
export default insectCountSubsampleShareTool;
