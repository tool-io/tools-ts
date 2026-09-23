import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inertia: number;
  readonly massUnitFactor: number;
  readonly lengthUnitFactor: number;
};
export type Output = { readonly convertedInertia: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inertia: { type: "number", minimum: 0 },
    massUnitFactor: { type: "number", exclusiveMinimum: 0 },
    lengthUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["inertia", "massUnitFactor", "lengthUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedInertia: { type: "number" } },
  required: ["convertedInertia"],
} as const;
/** Calculate segment inertia unit factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inertia, massUnitFactor, lengthUnitFactor } = request;
  const compute = (): Output => {
    H.domain(inertia >= 0);
    H.positive(massUnitFactor);
    H.positive(lengthUnitFactor);
    return {
      convertedInertia: inertia * massUnitFactor * lengthUnitFactor ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inertia: 2, massUnitFactor: 1, lengthUnitFactor: 0.01 },
  output: { convertedInertia: 0.0002 },
} satisfies ToolExample<Input, Output>;
export const segmentInertiaUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/segment-inertia-unit-factor",
    title: "Segment Inertia Unit Factor Tool",
    description:
      "Calculate segment inertia unit factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inertia: { type: "number", minimum: 0 },
        massUnitFactor: { type: "number", exclusiveMinimum: 0 },
        lengthUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["inertia", "massUnitFactor", "lengthUnitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedInertia: { type: "number" } },
      required: ["convertedInertia"],
    },
    ports: {
      inputs: [
        {
          id: "inertia",
          label: "Inertia",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "massUnitFactor",
          label: "Mass Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lengthUnitFactor",
          label: "Length Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedInertia",
          label: "Converted Inertia",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = segmentInertiaUnitFactorTool.execute;
export default segmentInertiaUnitFactorTool;
