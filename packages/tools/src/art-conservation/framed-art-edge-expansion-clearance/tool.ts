import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artWidth: number;
  readonly frameOpening: number;
  readonly expansionFraction: number;
};
export type Output = {
  readonly expandedWidth: number;
  readonly totalClearance: number;
  readonly perSide: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artWidth: { type: "number", minimum: 0 },
    frameOpening: { type: "number", minimum: 0 },
    expansionFraction: { type: "number", minimum: -1 },
  },
  required: ["artWidth", "frameOpening", "expansionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expandedWidth: { type: "number" },
    totalClearance: { type: "number" },
    perSide: { type: "number" },
  },
  required: ["expandedWidth", "totalClearance", "perSide"],
} as const;
/** Calculate framed art edge expansion clearance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artWidth, frameOpening, expansionFraction } = request;
  const compute = (): Output => {
    H.domain(artWidth >= 0 && frameOpening >= 0 && expansionFraction >= -1);
    return {
      expandedWidth: artWidth * (1 + expansionFraction),
      totalClearance: frameOpening - artWidth * (1 + expansionFraction),
      perSide: (frameOpening - artWidth * (1 + expansionFraction)) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { artWidth: 100, frameOpening: 104, expansionFraction: 0.02 },
  output: { expandedWidth: 102, totalClearance: 2, perSide: 1 },
} satisfies ToolExample<Input, Output>;
export const framedArtEdgeExpansionClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/framed-art-edge-expansion-clearance",
    title: "Framed Art Edge Expansion Clearance Tool",
    description:
      "Calculate framed art edge expansion clearance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artWidth: { type: "number", minimum: 0 },
        frameOpening: { type: "number", minimum: 0 },
        expansionFraction: { type: "number", minimum: -1 },
      },
      required: ["artWidth", "frameOpening", "expansionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expandedWidth: { type: "number" },
        totalClearance: { type: "number" },
        perSide: { type: "number" },
      },
      required: ["expandedWidth", "totalClearance", "perSide"],
    },
    ports: {
      inputs: [
        {
          id: "artWidth",
          label: "Art Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frameOpening",
          label: "Frame Opening",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expansionFraction",
          label: "Expansion Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expandedWidth",
          label: "Expanded Width",
          valueType: { type: "number" },
        },
        {
          id: "totalClearance",
          label: "Total Clearance",
          valueType: { type: "number" },
        },
        { id: "perSide", label: "Per Side", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = framedArtEdgeExpansionClearanceTool.execute;
export default framedArtEdgeExpansionClearanceTool;
