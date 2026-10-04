import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bars: number;
  readonly effectiveWidth: number;
  readonly overlap: number;
  readonly edgeLoss: number;
};
export type Output = { readonly coveredWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bars: { type: "integer", minimum: 1 },
    effectiveWidth: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
    edgeLoss: { type: "number", minimum: 0 },
  },
  required: ["bars", "effectiveWidth", "overlap", "edgeLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coveredWidth: { type: "number" } },
  required: ["coveredWidth"],
} as const;
/** Calculate lightbar spacing coverage width budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bars, effectiveWidth, overlap, edgeLoss } = request;
  const compute = (): Output => {
    H.integer(bars, 1);
    H.domain(
      effectiveWidth >= 0 &&
        overlap >= 0 &&
        overlap <= effectiveWidth &&
        edgeLoss >= 0,
    );
    return {
      coveredWidth:
        bars * effectiveWidth - Math.max(0, bars - 1) * overlap - 2 * edgeLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bars: 4, effectiveWidth: 0.5, overlap: 0.1, edgeLoss: 0.05 },
  output: { coveredWidth: 1.5999999999999999 },
} satisfies ToolExample<Input, Output>;
export const lightbarSpacingCoverageWidthBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/lightbar-spacing-coverage-width-budget",
    title: "Lightbar Spacing Coverage Width Budget Tool",
    description:
      "Calculate lightbar spacing coverage width budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bars: { type: "integer", minimum: 1 },
        effectiveWidth: { type: "number", minimum: 0 },
        overlap: { type: "number", minimum: 0 },
        edgeLoss: { type: "number", minimum: 0 },
      },
      required: ["bars", "effectiveWidth", "overlap", "edgeLoss"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coveredWidth: { type: "number" } },
      required: ["coveredWidth"],
    },
    ports: {
      inputs: [
        {
          id: "bars",
          label: "Bars",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effectiveWidth",
          label: "Effective Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeLoss",
          label: "Edge Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredWidth",
          label: "Covered Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lightbarSpacingCoverageWidthBudgetTool.execute;
export default lightbarSpacingCoverageWidthBudgetTool;
