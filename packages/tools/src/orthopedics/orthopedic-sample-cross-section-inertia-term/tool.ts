import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerWidth: number;
  readonly outerHeight: number;
  readonly innerWidth: number;
  readonly innerHeight: number;
};
export type Output = {
  readonly area: number;
  readonly inertiaX: number;
  readonly inertiaY: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerWidth: { type: "number", minimum: 0 },
    outerHeight: { type: "number", minimum: 0 },
    innerWidth: { type: "number", minimum: 0 },
    innerHeight: { type: "number", minimum: 0 },
  },
  required: ["outerWidth", "outerHeight", "innerWidth", "innerHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number" },
    inertiaX: { type: "number" },
    inertiaY: { type: "number" },
  },
  required: ["area", "inertiaX", "inertiaY"],
} as const;
/** Concentric hollow rectangular bench section area and centroidal second moments, without a bone or implant geometry fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerWidth, outerHeight, innerWidth, innerHeight } = request;
  const compute = (): Output => {
    H.domain(
      outerWidth >= 0 &&
        outerHeight >= 0 &&
        innerWidth >= 0 &&
        innerHeight >= 0 &&
        innerWidth <= outerWidth &&
        innerHeight <= outerHeight,
    );
    return {
      area: outerWidth * outerHeight - innerWidth * innerHeight,
      inertiaX:
        (outerWidth * outerHeight ** 3 - innerWidth * innerHeight ** 3) / 12,
      inertiaY:
        (outerHeight * outerWidth ** 3 - innerHeight * innerWidth ** 3) / 12,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerWidth: 4, outerHeight: 6, innerWidth: 2, innerHeight: 4 },
  output: {
    area: 16,
    inertiaX: 61.333333333333336,
    inertiaY: 29.333333333333332,
  },
} satisfies ToolExample<Input, Output>;
export const orthopedicSampleCrossSectionInertiaTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "orthopedics/orthopedic-sample-cross-section-inertia-term",
      title: "Orthopedic Sample Cross Section Inertia Term Tool",
      description:
        "Concentric hollow rectangular bench section area and centroidal second moments, without a bone or implant geometry fit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outerWidth: { type: "number", minimum: 0 },
          outerHeight: { type: "number", minimum: 0 },
          innerWidth: { type: "number", minimum: 0 },
          innerHeight: { type: "number", minimum: 0 },
        },
        required: ["outerWidth", "outerHeight", "innerWidth", "innerHeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number" },
          inertiaX: { type: "number" },
          inertiaY: { type: "number" },
        },
        required: ["area", "inertiaX", "inertiaY"],
      },
      ports: {
        inputs: [
          {
            id: "outerWidth",
            label: "Outer Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outerHeight",
            label: "Outer Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "innerWidth",
            label: "Inner Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "innerHeight",
            label: "Inner Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "area", label: "Area", valueType: { type: "number" } },
          { id: "inertiaX", label: "Inertia X", valueType: { type: "number" } },
          { id: "inertiaY", label: "Inertia Y", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = orthopedicSampleCrossSectionInertiaTermTool.execute;
export default orthopedicSampleCrossSectionInertiaTermTool;
