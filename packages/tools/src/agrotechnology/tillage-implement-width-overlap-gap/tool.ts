import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalWidth: number;
  readonly overlap: number;
  readonly lateralError: number;
};
export type Output = {
  readonly effectiveWidth: number;
  readonly worstCoverageGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalWidth: { type: "number" },
    overlap: { type: "number", minimum: 0 },
    lateralError: { type: "number" },
  },
  required: ["nominalWidth", "overlap", "lateralError"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveWidth: { type: "number" },
    worstCoverageGap: { type: "number" },
  },
  required: ["effectiveWidth", "worstCoverageGap"],
} as const;
/** Calculate tillage implement width overlap gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalWidth, overlap, lateralError } = request;
  const compute = (): Output => {
    H.domain(nominalWidth > overlap && overlap >= 0);
    return {
      effectiveWidth: nominalWidth - overlap,
      worstCoverageGap: Math.max(0, Math.abs(lateralError) - overlap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalWidth: 5, overlap: 0.5, lateralError: 0.2 },
  output: { effectiveWidth: 4.5, worstCoverageGap: 0 },
} satisfies ToolExample<Input, Output>;
export const tillageImplementWidthOverlapGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/tillage-implement-width-overlap-gap",
    title: "Tillage Implement Width Overlap Gap Tool",
    description:
      "Calculate tillage implement width overlap gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalWidth: { type: "number" },
        overlap: { type: "number", minimum: 0 },
        lateralError: { type: "number" },
      },
      required: ["nominalWidth", "overlap", "lateralError"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveWidth: { type: "number" },
        worstCoverageGap: { type: "number" },
      },
      required: ["effectiveWidth", "worstCoverageGap"],
    },
    ports: {
      inputs: [
        {
          id: "nominalWidth",
          label: "Nominal Width",
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
          id: "lateralError",
          label: "Lateral Error",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveWidth",
          label: "Effective Width",
          valueType: { type: "number" },
        },
        {
          id: "worstCoverageGap",
          label: "Worst Coverage Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tillageImplementWidthOverlapGapTool.execute;
export default tillageImplementWidthOverlapGapTool;
