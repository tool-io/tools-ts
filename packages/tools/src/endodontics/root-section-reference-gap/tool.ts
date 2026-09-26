import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionPositions: readonly number[];
  readonly suppliedReferencePositions: readonly number[];
  readonly sourceScale: number;
};
export type Output = {
  readonly positionGaps: readonly number[];
  readonly maximumAbsoluteGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    suppliedReferencePositions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    sourceScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sectionPositions", "suppliedReferencePositions", "sourceScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positionGaps: { type: "array", maxItems: 256, items: { type: "number" } },
    maximumAbsoluteGap: { type: "number" },
  },
  required: ["positionGaps", "maximumAbsoluteGap"],
} as const;
/** Calculate root section reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionPositions, suppliedReferencePositions, sourceScale } = request;
  const compute = (): Output => {
    H.sameLength(sectionPositions, suppliedReferencePositions);
    H.positive(sourceScale);
    return (() => {
      const positionGaps = sectionPositions.map(
        (x, i) => (x - suppliedReferencePositions[i]) * sourceScale,
      );
      return {
        positionGaps,
        maximumAbsoluteGap: Math.max(0, ...positionGaps.map(Math.abs)),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sectionPositions: [1, 3],
    suppliedReferencePositions: [1, 2],
    sourceScale: 2,
  },
  output: { positionGaps: [0, 2], maximumAbsoluteGap: 2 },
} satisfies ToolExample<Input, Output>;
export const rootSectionReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/root-section-reference-gap",
    title: "Root Section Reference Gap Tool",
    description:
      "Calculate root section reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedReferencePositions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sourceScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sectionPositions",
        "suppliedReferencePositions",
        "sourceScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positionGaps: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        maximumAbsoluteGap: { type: "number" },
      },
      required: ["positionGaps", "maximumAbsoluteGap"],
    },
    ports: {
      inputs: [
        {
          id: "sectionPositions",
          label: "Section Positions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedReferencePositions",
          label: "Supplied Reference Positions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceScale",
          label: "Source Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "positionGaps",
          label: "Position Gaps",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumAbsoluteGap",
          label: "Maximum Absolute Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rootSectionReferenceGapTool.execute;
export default rootSectionReferenceGapTool;
