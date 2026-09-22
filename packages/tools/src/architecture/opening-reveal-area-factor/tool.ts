import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly includeSill: boolean;
};
export type Output = { readonly revealArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    includeSill: { type: "boolean" },
  },
  required: ["width", "height", "depth", "includeSill"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { revealArea: { type: "number" } },
  required: ["revealArea"],
} as const;
/** Calculate opening reveal area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, depth, includeSill } = request;
  const compute = (): Output => {
    H.domain(width >= 0 && height >= 0 && depth >= 0);
    return {
      revealArea: (2 * height + width + (includeSill ? width : 0)) * depth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 2, height: 3, depth: 0.2, includeSill: true },
  output: { revealArea: 2 },
} satisfies ToolExample<Input, Output>;
export const openingRevealAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/opening-reveal-area-factor",
    title: "Opening Reveal Area Factor Tool",
    description:
      "Calculate opening reveal area factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        includeSill: { type: "boolean" },
      },
      required: ["width", "height", "depth", "includeSill"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { revealArea: { type: "number" } },
      required: ["revealArea"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeSill",
          label: "Include Sill",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "revealArea",
          label: "Reveal Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = openingRevealAreaFactorTool.execute;
export default openingRevealAreaFactorTool;
