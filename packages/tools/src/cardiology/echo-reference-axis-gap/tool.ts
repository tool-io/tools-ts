import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredAxis: readonly number[];
  readonly referenceAxis: readonly number[];
  readonly origin: readonly number[];
};
export type Output = {
  readonly endpointDifference: readonly number[];
  readonly lengthGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredAxis: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceAxis: { type: "array", maxItems: 256, items: { type: "number" } },
    origin: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["measuredAxis", "referenceAxis", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endpointDifference: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    lengthGap: { type: "number" },
  },
  required: ["endpointDifference", "lengthGap"],
} as const;
/** Compare explicit nonclinical image-axis endpoints under a shared origin, without physiological inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredAxis, referenceAxis, origin } = request;
  const compute = (): Output => {
    H.domain(
      measuredAxis.length === 2 &&
        referenceAxis.length === 2 &&
        origin.length === 2,
    );
    return {
      endpointDifference: measuredAxis.map((x, i) => x - referenceAxis[i]),
      lengthGap:
        Math.hypot(...measuredAxis.map((x, i) => x - origin[i])) -
        Math.hypot(...referenceAxis.map((x, i) => x - origin[i])),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredAxis: [3, 4], referenceAxis: [0, 4], origin: [0, 0] },
  output: { endpointDifference: [3, 0], lengthGap: 1 },
} satisfies ToolExample<Input, Output>;
export const echoReferenceAxisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/echo-reference-axis-gap",
    title: "Echo Reference Axis Gap Tool",
    description:
      "Compare explicit nonclinical image-axis endpoints under a shared origin, without physiological inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredAxis: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceAxis: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        origin: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["measuredAxis", "referenceAxis", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endpointDifference: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        lengthGap: { type: "number" },
      },
      required: ["endpointDifference", "lengthGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredAxis",
          label: "Measured Axis",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceAxis",
          label: "Reference Axis",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "endpointDifference",
          label: "Endpoint Difference",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "lengthGap", label: "Length Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = echoReferenceAxisGapTool.execute;
export default echoReferenceAxisGapTool;
