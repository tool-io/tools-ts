import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normal: readonly number[];
  readonly reference: readonly number[];
};
export type Output = {
  readonly dot: number;
  readonly sameHemisphere: boolean;
  readonly orthogonal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
    reference: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["normal", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dot: { type: "number" },
    sameHemisphere: { type: "boolean" },
    orthogonal: { type: "boolean" },
  },
  required: ["dot", "sameHemisphere", "orthogonal"],
} as const;
/** Compare supplied nonzero section-normal vectors with exact arithmetic sign tests, without assigning anatomical labels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { normal, reference } = request;
  const compute = (): Output => {
    H.domain(
      normal.length === 3 &&
        reference.length === 3 &&
        normal.some((x) => x !== 0) &&
        reference.some((x) => x !== 0),
    );
    const dot = H.dot(normal, reference);
    return { dot, sameHemisphere: dot > 0, orthogonal: dot === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { normal: [0, 0, 1], reference: [0, 0, -2] },
  output: { dot: -2, sameHemisphere: false, orthogonal: false },
} satisfies ToolExample<Input, Output>;
export const sectionPlaneNormalReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/section-plane-normal-reference-token",
    title: "Section Plane Normal Reference Token Tool",
    description:
      "Compare supplied nonzero section-normal vectors with exact arithmetic sign tests, without assigning anatomical labels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normal: { type: "array", maxItems: 256, items: { type: "number" } },
        reference: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["normal", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dot: { type: "number" },
        sameHemisphere: { type: "boolean" },
        orthogonal: { type: "boolean" },
      },
      required: ["dot", "sameHemisphere", "orthogonal"],
    },
    ports: {
      inputs: [
        {
          id: "normal",
          label: "Normal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "dot", label: "Dot", valueType: { type: "number" } },
        {
          id: "sameHemisphere",
          label: "Same Hemisphere",
          valueType: { type: "boolean" },
        },
        {
          id: "orthogonal",
          label: "Orthogonal",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sectionPlaneNormalReferenceTokenTool.execute;
export default sectionPlaneNormalReferenceTokenTool;
