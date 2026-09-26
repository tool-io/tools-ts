import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLandmark: readonly number[];
  readonly secondLandmark: readonly number[];
  readonly suppliedPixelsPerLength: number;
  readonly referenceLength: number;
};
export type Output = {
  readonly pixelDistance: number;
  readonly inferredLength: number;
  readonly lengthGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLandmark: { type: "array", maxItems: 256, items: { type: "number" } },
    secondLandmark: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedPixelsPerLength: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: [
    "firstLandmark",
    "secondLandmark",
    "suppliedPixelsPerLength",
    "referenceLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelDistance: { type: "number" },
    inferredLength: { type: "number" },
    lengthGap: { type: "number" },
  },
  required: ["pixelDistance", "inferredLength", "lengthGap"],
} as const;
/** Calculate wing landmark scale gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstLandmark,
    secondLandmark,
    suppliedPixelsPerLength,
    referenceLength,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstLandmark.length === 2 &&
        secondLandmark.length === 2 &&
        referenceLength >= 0,
    );
    H.positive(suppliedPixelsPerLength);
    return (() => {
      const pixelDistance = Math.hypot(
          ...firstLandmark.map((x, i) => x - secondLandmark[i]),
        ),
        inferredLength = pixelDistance / suppliedPixelsPerLength;
      return {
        pixelDistance,
        inferredLength,
        lengthGap: inferredLength - referenceLength,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLandmark: [0, 0],
    secondLandmark: [3, 4],
    suppliedPixelsPerLength: 2,
    referenceLength: 2,
  },
  output: { pixelDistance: 5, inferredLength: 2.5, lengthGap: 0.5 },
} satisfies ToolExample<Input, Output>;
export const wingLandmarkScaleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/wing-landmark-scale-gap",
    title: "Wing Landmark Scale Gap Tool",
    description:
      "Calculate wing landmark scale gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLandmark: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        secondLandmark: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedPixelsPerLength: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
      },
      required: [
        "firstLandmark",
        "secondLandmark",
        "suppliedPixelsPerLength",
        "referenceLength",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelDistance: { type: "number" },
        inferredLength: { type: "number" },
        lengthGap: { type: "number" },
      },
      required: ["pixelDistance", "inferredLength", "lengthGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstLandmark",
          label: "First Landmark",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondLandmark",
          label: "Second Landmark",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedPixelsPerLength",
          label: "Supplied Pixels Per Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pixelDistance",
          label: "Pixel Distance",
          valueType: { type: "number" },
        },
        {
          id: "inferredLength",
          label: "Inferred Length",
          valueType: { type: "number" },
        },
        { id: "lengthGap", label: "Length Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wingLandmarkScaleGapTool.execute;
export default wingLandmarkScaleGapTool;
