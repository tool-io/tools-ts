import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredWidth: number;
  readonly measuredHeight: number;
  readonly referenceHeight: number;
  readonly suppliedWidthGradient: number;
};
export type Output = {
  readonly referenceWidth: number;
  readonly adjustment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredWidth: { type: "number", minimum: 0 },
    measuredHeight: { type: "number" },
    referenceHeight: { type: "number" },
    suppliedWidthGradient: { type: "number" },
  },
  required: [
    "measuredWidth",
    "measuredHeight",
    "referenceHeight",
    "suppliedWidthGradient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceWidth: { type: "number" },
    adjustment: { type: "number" },
  },
  required: ["referenceWidth", "adjustment"],
} as const;
/** Local linear width-height adjustment using a supplied gradient, not reconstructed terrain geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredWidth,
    measuredHeight,
    referenceHeight,
    suppliedWidthGradient,
  } = request;
  const compute = (): Output => {
    H.domain(measuredWidth >= 0);
    return {
      referenceWidth:
        measuredWidth +
        suppliedWidthGradient * (referenceHeight - measuredHeight),
      adjustment: suppliedWidthGradient * (referenceHeight - measuredHeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredWidth: 100,
    measuredHeight: 10,
    referenceHeight: 12,
    suppliedWidthGradient: 3,
  },
  output: { referenceWidth: 106, adjustment: 6 },
} satisfies ToolExample<Input, Output>;
export const valleyWidthReferenceHeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/valley-width-reference-height-gap",
    title: "Valley Width Reference Height Gap Tool",
    description:
      "Local linear width-height adjustment using a supplied gradient, not reconstructed terrain geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredWidth: { type: "number", minimum: 0 },
        measuredHeight: { type: "number" },
        referenceHeight: { type: "number" },
        suppliedWidthGradient: { type: "number" },
      },
      required: [
        "measuredWidth",
        "measuredHeight",
        "referenceHeight",
        "suppliedWidthGradient",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceWidth: { type: "number" },
        adjustment: { type: "number" },
      },
      required: ["referenceWidth", "adjustment"],
    },
    ports: {
      inputs: [
        {
          id: "measuredWidth",
          label: "Measured Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredHeight",
          label: "Measured Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceHeight",
          label: "Reference Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWidthGradient",
          label: "Supplied Width Gradient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceWidth",
          label: "Reference Width",
          valueType: { type: "number" },
        },
        {
          id: "adjustment",
          label: "Adjustment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = valleyWidthReferenceHeightGapTool.execute;
export default valleyWidthReferenceHeightGapTool;
