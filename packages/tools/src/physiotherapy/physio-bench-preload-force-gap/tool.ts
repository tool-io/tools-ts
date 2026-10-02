import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly preload: number;
  readonly expectedIncrement: number;
};
export type Output = { readonly netForce: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number" },
    preload: { type: "number" },
    expectedIncrement: { type: "number" },
  },
  required: ["force", "preload", "expectedIncrement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netForce: { type: "number" }, residual: { type: "number" } },
  required: ["netForce", "residual"],
} as const;
/** Signed bench preload correction and supplied reference comparison. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, preload, expectedIncrement } = request;
  const compute = (): Output => {
    return {
      netForce: force - preload,
      residual: force - preload - expectedIncrement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 30, preload: 10, expectedIncrement: 15 },
  output: { netForce: 20, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const physioBenchPreloadForceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/physio-bench-preload-force-gap",
    title: "Physio Bench Preload Force Gap Tool",
    description:
      "Signed bench preload correction and supplied reference comparison.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number" },
        preload: { type: "number" },
        expectedIncrement: { type: "number" },
      },
      required: ["force", "preload", "expectedIncrement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netForce: { type: "number" },
        residual: { type: "number" },
      },
      required: ["netForce", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preload",
          label: "Preload",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedIncrement",
          label: "Expected Increment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netForce", label: "Net Force", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = physioBenchPreloadForceGapTool.execute;
export default physioBenchPreloadForceGapTool;
