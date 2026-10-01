import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly span: number;
  readonly width: number;
  readonly thickness: number;
};
export type Output = {
  readonly moment: number;
  readonly sectionModulus: number;
  readonly flexuralStress: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number" },
    span: { type: "number", minimum: 0 },
    width: { type: "number", exclusiveMinimum: 0 },
    thickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["force", "span", "width", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moment: { type: "number" },
    sectionModulus: { type: "number" },
    flexuralStress: { type: "number" },
  },
  required: ["moment", "sectionModulus", "flexuralStress"],
} as const;
/** Ideal central three-point bending of a rectangular phantom beam, not a bone strength or implant safety assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, span, width, thickness } = request;
  const compute = (): Output => {
    H.domain(span >= 0);
    H.positive(width);
    H.positive(thickness);
    return {
      moment: (force * span) / 4,
      sectionModulus: (width * thickness ** 2) / 6,
      flexuralStress: (3 * force * span) / (2 * width * thickness ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 100, span: 40, width: 10, thickness: 4 },
  output: {
    moment: 1000,
    sectionModulus: 26.666666666666668,
    flexuralStress: 37.5,
  },
} satisfies ToolExample<Input, Output>;
export const bonePhantomBendingStressTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/bone-phantom-bending-stress-term",
    title: "Bone Phantom Bending Stress Term Tool",
    description:
      "Ideal central three-point bending of a rectangular phantom beam, not a bone strength or implant safety assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number" },
        span: { type: "number", minimum: 0 },
        width: { type: "number", exclusiveMinimum: 0 },
        thickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["force", "span", "width", "thickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moment: { type: "number" },
        sectionModulus: { type: "number" },
        flexuralStress: { type: "number" },
      },
      required: ["moment", "sectionModulus", "flexuralStress"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "moment", label: "Moment", valueType: { type: "number" } },
        {
          id: "sectionModulus",
          label: "Section Modulus",
          valueType: { type: "number" },
        },
        {
          id: "flexuralStress",
          label: "Flexural Stress",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bonePhantomBendingStressTermTool.execute;
export default bonePhantomBendingStressTermTool;
