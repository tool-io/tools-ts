import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly quantum: number;
  readonly suppliedLimit: number;
  readonly mode: string;
};
export type Output = { readonly rounded: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    quantum: { type: "number", exclusiveMinimum: 0 },
    suppliedLimit: { type: "number" },
    mode: {
      type: "string",
      maxLength: 8192,
      enum: ["floor", "ceil", "nearest"],
    },
  },
  required: ["value", "quantum", "suppliedLimit", "mode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rounded: { type: "number" }, margin: { type: "number" } },
  required: ["rounded", "margin"],
} as const;
/** Compare an explicitly quantized measurement with a supplied upper limit; nearest ties are toward positive infinity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, quantum, suppliedLimit, mode } = request;
  const compute = (): Output => {
    H.positive(quantum);
    H.domain(["floor", "ceil", "nearest"].includes(mode));
    return {
      rounded:
        (mode === "floor"
          ? Math.floor(value / quantum)
          : mode === "ceil"
            ? Math.ceil(value / quantum)
            : Math.round(value / quantum)) * quantum,
      margin:
        suppliedLimit -
        (mode === "floor"
          ? Math.floor(value / quantum)
          : mode === "ceil"
            ? Math.ceil(value / quantum)
            : Math.round(value / quantum)) *
          quantum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 4.6, quantum: 1, suppliedLimit: 5, mode: "ceil" },
  output: { rounded: 5, margin: 0 },
} satisfies ToolExample<Input, Output>;
export const specificationRoundingMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/specification-rounding-margin",
    title: "Specification Rounding Margin Tool",
    description:
      "Compare an explicitly quantized measurement with a supplied upper limit; nearest ties are toward positive infinity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        quantum: { type: "number", exclusiveMinimum: 0 },
        suppliedLimit: { type: "number" },
        mode: {
          type: "string",
          maxLength: 8192,
          enum: ["floor", "ceil", "nearest"],
        },
      },
      required: ["value", "quantum", "suppliedLimit", "mode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rounded: { type: "number" }, margin: { type: "number" } },
      required: ["rounded", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mode",
          label: "Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "rounded", label: "Rounded", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = specificationRoundingMarginTool.execute;
export default specificationRoundingMarginTool;
