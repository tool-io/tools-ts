import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heading: number;
  readonly sectorCount: number;
  readonly boundaryPolicy: string;
};
export type Output = {
  readonly sectorIndex: number;
  readonly normalizedHeading: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heading: { type: "number" },
    sectorCount: { type: "integer", minimum: 1, maximum: 256 },
    boundaryPolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["clockwise", "counterclockwise"],
    },
  },
  required: ["heading", "sectorCount", "boundaryPolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectorIndex: { type: "integer" },
    normalizedHeading: { type: "number" },
  },
  required: ["sectorIndex", "normalizedHeading"],
} as const;
/** Equal sectors beginning at north, with an explicit side assigned to exact boundary headings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heading, sectorCount, boundaryPolicy } = request;
  const compute = (): Output => {
    H.integer(sectorCount, 1, 256);
    H.domain(["clockwise", "counterclockwise"].includes(boundaryPolicy));
    const r = heading % 360,
      normalizedHeading = r < 0 ? r + 360 : r,
      z = normalizedHeading / (360 / sectorCount);
    const sectorIndex =
      boundaryPolicy === "counterclockwise" && Number.isInteger(z)
        ? (z - 1 + sectorCount) % sectorCount
        : Math.floor(z) % sectorCount;
    return { sectorIndex, normalizedHeading };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heading: 90, sectorCount: 4, boundaryPolicy: "clockwise" },
  output: { sectorIndex: 1, normalizedHeading: 90 },
} satisfies ToolExample<Input, Output>;
export const compassCardSectorBoundaryPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/compass-card-sector-boundary-policy",
    title: "Compass Card Sector Boundary Policy Tool",
    description:
      "Equal sectors beginning at north, with an explicit side assigned to exact boundary headings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heading: { type: "number" },
        sectorCount: { type: "integer", minimum: 1, maximum: 256 },
        boundaryPolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["clockwise", "counterclockwise"],
        },
      },
      required: ["heading", "sectorCount", "boundaryPolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectorIndex: { type: "integer" },
        normalizedHeading: { type: "number" },
      },
      required: ["sectorIndex", "normalizedHeading"],
    },
    ports: {
      inputs: [
        {
          id: "heading",
          label: "Heading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sectorCount",
          label: "Sector Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "boundaryPolicy",
          label: "Boundary Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sectorIndex",
          label: "Sector Index",
          valueType: { type: "integer" },
        },
        {
          id: "normalizedHeading",
          label: "Normalized Heading",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compassCardSectorBoundaryPolicyTool.execute;
export default compassCardSectorBoundaryPolicyTool;
