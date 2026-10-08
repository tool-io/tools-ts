import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly error: number; readonly halfWidth: number };
export type Output = {
  readonly outsideError: number;
  readonly insideDeadband: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    error: { type: "number" },
    halfWidth: { type: "number", minimum: 0 },
  },
  required: ["error", "halfWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outsideError: { type: "number" },
    insideDeadband: { type: "boolean" },
  },
  required: ["outsideError", "insideDeadband"],
} as const;
/** Apply an explicit symmetric inclusive zero deadband and return signed excess beyond its nearest edge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { error, halfWidth } = request;
  const compute = (): Output => {
    H.domain(halfWidth >= 0, "halfWidth");
    return {
      outsideError:
        error > halfWidth
          ? error - halfWidth
          : error < -halfWidth
            ? error + halfWidth
            : 0,
      insideDeadband: Math.abs(error) <= halfWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { error: 5, halfWidth: 2 },
  output: { outsideError: 3, insideDeadband: false },
} satisfies ToolExample<Input, Output>;
export const controlErrorDeadbandEdgeDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/control-error-deadband-edge-distance",
    title: "Control Error Deadband Edge Distance Tool",
    description:
      "Apply an explicit symmetric inclusive zero deadband and return signed excess beyond its nearest edge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        error: { type: "number" },
        halfWidth: { type: "number", minimum: 0 },
      },
      required: ["error", "halfWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outsideError: { type: "number" },
        insideDeadband: { type: "boolean" },
      },
      required: ["outsideError", "insideDeadband"],
    },
    ports: {
      inputs: [
        {
          id: "error",
          label: "Error",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "halfWidth",
          label: "Half Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outsideError",
          label: "Outside Error",
          valueType: { type: "number" },
        },
        {
          id: "insideDeadband",
          label: "Inside Deadband",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = controlErrorDeadbandEdgeDistanceTool.execute;
export default controlErrorDeadbandEdgeDistanceTool;
