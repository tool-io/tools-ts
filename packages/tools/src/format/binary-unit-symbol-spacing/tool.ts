import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: string;
  readonly unit: string;
  readonly noBreak: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    unit: {
      type: "string",
      maxLength: 8192,
      enum: ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB"],
    },
    noBreak: { type: "boolean" },
  },
  required: ["value", "unit", "noBreak"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate binary unit symbol spacing from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, unit, noBreak } = request;
  const compute = (): Output => {
    H.domain(["KiB", "MiB", "GiB", "TiB", "PiB", "EiB"].includes(unit));
    return { text: value + (noBreak ? "\u00a0" : " ") + unit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: "8", unit: "MiB", noBreak: true },
  output: { text: "8 MiB" },
} satisfies ToolExample<Input, Output>;
export const binaryUnitSymbolSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/binary-unit-symbol-spacing",
    title: "Binary Unit Symbol Spacing Tool",
    description:
      "Calculate binary unit symbol spacing from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        unit: {
          type: "string",
          maxLength: 8192,
          enum: ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB"],
        },
        noBreak: { type: "boolean" },
      },
      required: ["value", "unit", "noBreak"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "noBreak",
          label: "No Break",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = binaryUnitSymbolSpacingTool.execute;
export default binaryUnitSymbolSpacingTool;
