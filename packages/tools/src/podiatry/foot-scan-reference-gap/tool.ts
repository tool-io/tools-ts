import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pointCoordinates: readonly (readonly number[])[];
  readonly referenceCoordinates: readonly (readonly number[])[];
};
export type Output = {
  readonly distances: readonly number[];
  readonly meanDistance: number;
  readonly maximumDistance: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pointCoordinates: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
    referenceCoordinates: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["pointCoordinates", "referenceCoordinates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distances: { type: "array", maxItems: 256, items: { type: "number" } },
    meanDistance: { type: "number" },
    maximumDistance: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["distances", "meanDistance", "maximumDistance", "defined"],
} as const;
/** Compare already registered research scan points; no registration algorithm or clinical fit assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pointCoordinates, referenceCoordinates } = request;
  const compute = (): Output => {
    H.sameLength(pointCoordinates, referenceCoordinates);
    H.domain(
      pointCoordinates.every((p) => p.length === 3) &&
        referenceCoordinates.every((p) => p.length === 3),
    );
    return (() => {
      const distances = pointCoordinates.map((p, i) =>
        Math.hypot(...p.map((x, j) => x - referenceCoordinates[i][j])),
      );
      return {
        distances,
        meanDistance: distances.length
          ? distances.reduce((a, b) => a + b, 0) / distances.length
          : 0,
        maximumDistance: Math.max(0, ...distances),
        defined: distances.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pointCoordinates: [
      [0, 0, 0],
      [1, 2, 3],
    ],
    referenceCoordinates: [
      [0, 0, 0],
      [1, 2, 5],
    ],
  },
  output: {
    distances: [0, 2],
    meanDistance: 1,
    maximumDistance: 2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const footScanReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/foot-scan-reference-gap",
    title: "Foot Scan Reference Gap Tool",
    description:
      "Compare already registered research scan points; no registration algorithm or clinical fit assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pointCoordinates: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
        referenceCoordinates: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
      },
      required: ["pointCoordinates", "referenceCoordinates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distances: { type: "array", maxItems: 256, items: { type: "number" } },
        meanDistance: { type: "number" },
        maximumDistance: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["distances", "meanDistance", "maximumDistance", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "pointCoordinates",
          label: "Point Coordinates",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
        {
          id: "referenceCoordinates",
          label: "Reference Coordinates",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
      ],
      outputs: [
        {
          id: "distances",
          label: "Distances",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "meanDistance",
          label: "Mean Distance",
          valueType: { type: "number" },
        },
        {
          id: "maximumDistance",
          label: "Maximum Distance",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = footScanReferenceGapTool.execute;
export default footScanReferenceGapTool;
