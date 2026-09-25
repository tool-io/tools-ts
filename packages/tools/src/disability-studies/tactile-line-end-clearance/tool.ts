import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineEnd: number;
  readonly boundary: number;
  readonly requiredGap: number;
};
export type Output = { readonly measuredGap: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineEnd: { type: "number" },
    boundary: { type: "number" },
    requiredGap: { type: "number", minimum: 0 },
  },
  required: ["lineEnd", "boundary", "requiredGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { measuredGap: { type: "number" }, margin: { type: "number" } },
  required: ["measuredGap", "margin"],
} as const;
/** Signed one-dimensional clearance against a supplied tactile-layout requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineEnd, boundary, requiredGap } = request;
  const compute = (): Output => {
    H.domain(requiredGap >= 0);
    return {
      measuredGap: boundary - lineEnd,
      margin: boundary - lineEnd - requiredGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineEnd: 90, boundary: 100, requiredGap: 5 },
  output: { measuredGap: 10, margin: 5 },
} satisfies ToolExample<Input, Output>;
export const tactileLineEndClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/tactile-line-end-clearance",
    title: "Tactile Line End Clearance Tool",
    description:
      "Signed one-dimensional clearance against a supplied tactile-layout requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineEnd: { type: "number" },
        boundary: { type: "number" },
        requiredGap: { type: "number", minimum: 0 },
      },
      required: ["lineEnd", "boundary", "requiredGap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredGap: { type: "number" },
        margin: { type: "number" },
      },
      required: ["measuredGap", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "lineEnd",
          label: "Line End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundary",
          label: "Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredGap",
          label: "Required Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredGap",
          label: "Measured Gap",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tactileLineEndClearanceTool.execute;
export default tactileLineEndClearanceTool;
