import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slicePositions: readonly number[];
  readonly expectedPositions: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly expectedSlices: number;
  readonly matchedExpectedSlices: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slicePositions: { type: "array", maxItems: 256, items: { type: "number" } },
    expectedPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["slicePositions", "expectedPositions", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedSlices: { type: "integer" },
    matchedExpectedSlices: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["expectedSlices", "matchedExpectedSlices", "share", "defined"],
} as const;
/** Count expected stack positions with at least one supplied slice within an explicit tolerance; no reconstruction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slicePositions, expectedPositions, tolerance } = request;
  const compute = (): Output => {
    H.domain(
      tolerance >= 0 &&
        new Set(expectedPositions).size === expectedPositions.length,
    );
    return (() => {
      const matchedExpectedSlices = expectedPositions.filter((x) =>
        slicePositions.some((y) => Math.abs(y - x) <= tolerance),
      ).length;
      return {
        expectedSlices: expectedPositions.length,
        matchedExpectedSlices,
        share:
          expectedPositions.length > 0
            ? matchedExpectedSlices / expectedPositions.length
            : 0,
        defined: expectedPositions.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slicePositions: [0, 2], expectedPositions: [0, 1, 2], tolerance: 0 },
  output: {
    expectedSlices: 3,
    matchedExpectedSlices: 2,
    share: 0.6666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const scanStackSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/scan-stack-support-share",
    title: "Scan Stack Support Share Tool",
    description:
      "Count expected stack positions with at least one supplied slice within an explicit tolerance; no reconstruction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slicePositions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        expectedPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["slicePositions", "expectedPositions", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedSlices: { type: "integer" },
        matchedExpectedSlices: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["expectedSlices", "matchedExpectedSlices", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "slicePositions",
          label: "Slice Positions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "expectedPositions",
          label: "Expected Positions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedSlices",
          label: "Expected Slices",
          valueType: { type: "integer" },
        },
        {
          id: "matchedExpectedSlices",
          label: "Matched Expected Slices",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = scanStackSupportShareTool.execute;
export default scanStackSupportShareTool;
