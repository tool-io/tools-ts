import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly relativeDegrees: number };
export type Output = { readonly sector: string; readonly normalized: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeDegrees: { type: "number" } },
  required: ["relativeDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sector: { type: "string", maxLength: 8192 },
    normalized: { type: "number" },
  },
  required: ["sector", "normalized"],
} as const;
/** Calculate relative bearing bow quarter label from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { relativeDegrees } = request;
  const compute = (): Output => {
    const normalized = H.mod(relativeDegrees, 360);
    return {
      sector:
        normalized === 0
          ? "ahead"
          : normalized === 180
            ? "astern"
            : normalized < 180
              ? "starboard"
              : "port",
      normalized,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { relativeDegrees: 45 },
  output: { sector: "starboard", normalized: 45 },
} satisfies ToolExample<Input, Output>;
export const relativeBearingBowQuarterLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/relative-bearing-bow-quarter-label",
    title: "Relative Bearing Bow Quarter Label Tool",
    description:
      "Calculate relative bearing bow quarter label from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeDegrees: { type: "number" } },
      required: ["relativeDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sector: { type: "string", maxLength: 8192 },
        normalized: { type: "number" },
      },
      required: ["sector", "normalized"],
    },
    ports: {
      inputs: [
        {
          id: "relativeDegrees",
          label: "Relative Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sector", label: "Sector", valueType: { type: "string" } },
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = relativeBearingBowQuarterLabelTool.execute;
export default relativeBearingBowQuarterLabelTool;
