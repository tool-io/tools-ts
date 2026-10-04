import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalWidth: number;
  readonly obstructionWidths: readonly number[];
  readonly requiredClearWidth: number;
};
export type Output = { readonly clearWidth: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWidth: { type: "number", minimum: 0 },
    obstructionWidths: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    requiredClearWidth: { type: "number", minimum: 0 },
  },
  required: ["totalWidth", "obstructionWidths", "requiredClearWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clearWidth: { type: "number" }, residual: { type: "number" } },
  required: ["clearWidth", "residual"],
} as const;
/** Subtract explicit additive obstruction widths and compare with a supplied requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalWidth, obstructionWidths, requiredClearWidth } = request;
  const compute = (): Output => {
    H.domain(
      totalWidth >= 0 &&
        requiredClearWidth >= 0 &&
        obstructionWidths.every((x) => x >= 0),
    );
    return {
      clearWidth: totalWidth - obstructionWidths.reduce((a, b) => a + b, 0),
      residual:
        totalWidth -
        obstructionWidths.reduce((a, b) => a + b, 0) -
        requiredClearWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalWidth: 4, obstructionWidths: [0.5, 1], requiredClearWidth: 2 },
  output: { clearWidth: 2.5, residual: 0.5 },
} satisfies ToolExample<Input, Output>;
export const sidewalkClearWidthResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/sidewalk-clear-width-residual",
    title: "Sidewalk Clear Width Residual Tool",
    description:
      "Subtract explicit additive obstruction widths and compare with a supplied requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWidth: { type: "number", minimum: 0 },
        obstructionWidths: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        requiredClearWidth: { type: "number", minimum: 0 },
      },
      required: ["totalWidth", "obstructionWidths", "requiredClearWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearWidth: { type: "number" },
        residual: { type: "number" },
      },
      required: ["clearWidth", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "totalWidth",
          label: "Total Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "obstructionWidths",
          label: "Obstruction Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "requiredClearWidth",
          label: "Required Clear Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "clearWidth",
          label: "Clear Width",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sidewalkClearWidthResidualTool.execute;
export default sidewalkClearWidthResidualTool;
