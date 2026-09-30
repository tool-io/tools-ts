import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bufferUsed: number;
  readonly bufferTotal: number;
  readonly workCompleteFraction: number;
};
export type Output = {
  readonly bufferFraction: number;
  readonly index: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bufferUsed: { type: "number", minimum: 0 },
    bufferTotal: { type: "number", exclusiveMinimum: 0 },
    workCompleteFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["bufferUsed", "bufferTotal", "workCompleteFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bufferFraction: { type: "number" }, index: { type: "number" } },
  required: ["bufferFraction", "index"],
} as const;
/** Calculate project buffer consumption index term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bufferUsed, bufferTotal, workCompleteFraction } = request;
  const compute = (): Output => {
    H.positive(bufferTotal);
    H.domain(
      bufferUsed >= 0 &&
        bufferUsed <= bufferTotal &&
        workCompleteFraction > 0 &&
        workCompleteFraction <= 1,
    );
    return {
      bufferFraction: bufferUsed / bufferTotal,
      index: bufferUsed / bufferTotal / workCompleteFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bufferUsed: 4, bufferTotal: 10, workCompleteFraction: 0.5 },
  output: { bufferFraction: 0.4, index: 0.8 },
} satisfies ToolExample<Input, Output>;
export const projectBufferConsumptionIndexTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/project-buffer-consumption-index-term",
    title: "Project Buffer Consumption Index Term Tool",
    description:
      "Calculate project buffer consumption index term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bufferUsed: { type: "number", minimum: 0 },
        bufferTotal: { type: "number", exclusiveMinimum: 0 },
        workCompleteFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: ["bufferUsed", "bufferTotal", "workCompleteFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bufferFraction: { type: "number" },
        index: { type: "number" },
      },
      required: ["bufferFraction", "index"],
    },
    ports: {
      inputs: [
        {
          id: "bufferUsed",
          label: "Buffer Used",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bufferTotal",
          label: "Buffer Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "workCompleteFraction",
          label: "Work Complete Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bufferFraction",
          label: "Buffer Fraction",
          valueType: { type: "number" },
        },
        { id: "index", label: "Index", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = projectBufferConsumptionIndexTermTool.execute;
export default projectBufferConsumptionIndexTermTool;
