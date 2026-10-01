import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedSegments: readonly number[];
  readonly referenceSegments: readonly number[];
};
export type Output = {
  readonly observedLength: number;
  readonly referenceLength: number;
  readonly lengthGap: number;
  readonly relativeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSegments: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    referenceSegments: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["observedSegments", "referenceSegments"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedLength: { type: "number" },
    referenceLength: { type: "number" },
    lengthGap: { type: "number" },
    relativeGap: { type: "number" },
  },
  required: ["observedLength", "referenceLength", "lengthGap", "relativeGap"],
} as const;
/** Calculate arch curve reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedSegments, referenceSegments } = request;
  const compute = (): Output => {
    H.sameLength(observedSegments, referenceSegments);
    H.domain([...observedSegments, ...referenceSegments].every((x) => x >= 0));
    return (() => {
      const observedLength = observedSegments.reduce((a, b) => a + b, 0),
        referenceLength = referenceSegments.reduce((a, b) => a + b, 0);
      H.positive(referenceLength);
      return {
        observedLength,
        referenceLength,
        lengthGap: observedLength - referenceLength,
        relativeGap: (observedLength - referenceLength) / referenceLength,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedSegments: [2, 3], referenceSegments: [2, 2] },
  output: {
    observedLength: 5,
    referenceLength: 4,
    lengthGap: 1,
    relativeGap: 0.25,
  },
} satisfies ToolExample<Input, Output>;
export const archCurveReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/arch-curve-reference-gap",
    title: "Arch Curve Reference Gap Tool",
    description:
      "Calculate arch curve reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedSegments: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceSegments: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["observedSegments", "referenceSegments"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedLength: { type: "number" },
        referenceLength: { type: "number" },
        lengthGap: { type: "number" },
        relativeGap: { type: "number" },
      },
      required: [
        "observedLength",
        "referenceLength",
        "lengthGap",
        "relativeGap",
      ],
    },
    ports: {
      inputs: [
        {
          id: "observedSegments",
          label: "Observed Segments",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceSegments",
          label: "Reference Segments",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "observedLength",
          label: "Observed Length",
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          valueType: { type: "number" },
        },
        { id: "lengthGap", label: "Length Gap", valueType: { type: "number" } },
        {
          id: "relativeGap",
          label: "Relative Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = archCurveReferenceGapTool.execute;
export default archCurveReferenceGapTool;
