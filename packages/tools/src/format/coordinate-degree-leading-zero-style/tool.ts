import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly magnitude: number;
  readonly width: number;
  readonly decimals: number;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 6 },
    decimals: { type: "integer", minimum: 0, maximum: 12 },
  },
  required: ["magnitude", "width", "decimals"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Render a nonnegative degree magnitude to explicit display precision; this is formatting rather than a rounded core calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { magnitude, width, decimals } = request;
  const compute = (): Output => {
    H.domain(magnitude >= 0);
    H.integer(width, 1, 6);
    H.integer(decimals, 0, 12);
    const fixed = magnitude.toFixed(decimals),
      p = fixed.split(".");
    return {
      text: p[0].padStart(width, "0") + (p.length > 1 ? "." + p[1] : "") + "°",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { magnitude: 7.5, width: 3, decimals: 2 },
  output: { text: "007.50°" },
} satisfies ToolExample<Input, Output>;
export const coordinateDegreeLeadingZeroStyleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/coordinate-degree-leading-zero-style",
    title: "Coordinate Degree Leading Zero Style Tool",
    description:
      "Render a nonnegative degree magnitude to explicit display precision; this is formatting rather than a rounded core calculation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magnitude: { type: "number", minimum: 0 },
        width: { type: "integer", minimum: 1, maximum: 6 },
        decimals: { type: "integer", minimum: 0, maximum: 12 },
      },
      required: ["magnitude", "width", "decimals"],
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
          id: "magnitude",
          label: "Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "decimals",
          label: "Decimals",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = coordinateDegreeLeadingZeroStyleTool.execute;
export default coordinateDegreeLeadingZeroStyleTool;
