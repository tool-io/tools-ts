import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly perimeter: number;
  readonly accessibleSegments: readonly number[];
  readonly suppliedOverlap: number;
};
export type Output = {
  readonly accessibleLength: number;
  readonly accessShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perimeter: { type: "number", exclusiveMinimum: 0 },
    accessibleSegments: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    suppliedOverlap: { type: "number", minimum: 0 },
  },
  required: ["perimeter", "accessibleSegments", "suppliedOverlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessibleLength: { type: "number" },
    accessShare: { type: "number" },
  },
  required: ["accessibleLength", "accessShare"],
} as const;
/** Calculate block perimeter access share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perimeter, accessibleSegments, suppliedOverlap } = request;
  const compute = (): Output => {
    H.positive(perimeter);
    H.domain(
      accessibleSegments.every((x) => x >= 0) &&
        suppliedOverlap >= 0 &&
        suppliedOverlap <= accessibleSegments.reduce((a, b) => a + b, 0) &&
        accessibleSegments.reduce((a, b) => a + b, 0) - suppliedOverlap <=
          perimeter,
    );
    return {
      accessibleLength:
        accessibleSegments.reduce((a, b) => a + b, 0) - suppliedOverlap,
      accessShare:
        (accessibleSegments.reduce((a, b) => a + b, 0) - suppliedOverlap) /
        perimeter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perimeter: 100, accessibleSegments: [30, 20], suppliedOverlap: 10 },
  output: { accessibleLength: 40, accessShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const blockPerimeterAccessShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/block-perimeter-access-share",
    title: "Block Perimeter Access Share Tool",
    description:
      "Calculate block perimeter access share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perimeter: { type: "number", exclusiveMinimum: 0 },
        accessibleSegments: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedOverlap: { type: "number", minimum: 0 },
      },
      required: ["perimeter", "accessibleSegments", "suppliedOverlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accessibleLength: { type: "number" },
        accessShare: { type: "number" },
      },
      required: ["accessibleLength", "accessShare"],
    },
    ports: {
      inputs: [
        {
          id: "perimeter",
          label: "Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accessibleSegments",
          label: "Accessible Segments",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedOverlap",
          label: "Supplied Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "accessibleLength",
          label: "Accessible Length",
          valueType: { type: "number" },
        },
        {
          id: "accessShare",
          label: "Access Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = blockPerimeterAccessShareTool.execute;
export default blockPerimeterAccessShareTool;
