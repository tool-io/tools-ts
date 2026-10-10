import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sphereDiopters: number;
  readonly cylinderDiopters: number;
  readonly axisDegrees: number;
};
export type Output = {
  readonly axisPowerDiopters: number;
  readonly orthogonalPowerDiopters: number;
  readonly orthogonalAxisDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sphereDiopters: { type: "number" },
    cylinderDiopters: { type: "number" },
    axisDegrees: { type: "number", minimum: 0, exclusiveMaximum: 180 },
  },
  required: ["sphereDiopters", "cylinderDiopters", "axisDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisPowerDiopters: { type: "number" },
    orthogonalPowerDiopters: { type: "number" },
    orthogonalAxisDegrees: { type: "number" },
  },
  required: [
    "axisPowerDiopters",
    "orthogonalPowerDiopters",
    "orthogonalAxisDegrees",
  ],
} as const;
/** Return explicit spherocylindrical principal-meridian powers and the orthogonal axis without prescribing lenses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sphereDiopters, cylinderDiopters, axisDegrees } = request;
  const compute = (): Output => {
    H.domain(axisDegrees >= 0 && axisDegrees < 180, "axisDegrees");
    return {
      axisPowerDiopters: sphereDiopters,
      orthogonalPowerDiopters: sphereDiopters + cylinderDiopters,
      orthogonalAxisDegrees: (axisDegrees + 90) % 180,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sphereDiopters: -2, cylinderDiopters: -1, axisDegrees: 30 },
  output: {
    axisPowerDiopters: -2,
    orthogonalPowerDiopters: -3,
    orthogonalAxisDegrees: 120,
  },
} satisfies ToolExample<Input, Output>;
export const lensMeridianPowerPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["optometry", "health and medicine"],
      keywords: ["optometry", "health and medicine"],
    },
    id: "optometry/lens-meridian-power-pair",
    title: "Lens Meridian Power Pair",
    description:
      "Return explicit spherocylindrical principal-meridian powers and the orthogonal axis without prescribing lenses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sphereDiopters: { type: "number" },
        cylinderDiopters: { type: "number" },
        axisDegrees: { type: "number", minimum: 0, exclusiveMaximum: 180 },
      },
      required: ["sphereDiopters", "cylinderDiopters", "axisDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisPowerDiopters: { type: "number" },
        orthogonalPowerDiopters: { type: "number" },
        orthogonalAxisDegrees: { type: "number" },
      },
      required: [
        "axisPowerDiopters",
        "orthogonalPowerDiopters",
        "orthogonalAxisDegrees",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sphereDiopters",
          label: "Sphere Diopters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cylinderDiopters",
          label: "Cylinder Diopters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "axisDegrees",
          label: "Axis Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "axisPowerDiopters",
          label: "Axis Power Diopters",
          valueType: { type: "number" },
        },
        {
          id: "orthogonalPowerDiopters",
          label: "Orthogonal Power Diopters",
          valueType: { type: "number" },
        },
        {
          id: "orthogonalAxisDegrees",
          label: "Orthogonal Axis Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lensMeridianPowerPairTool.execute;
export default lensMeridianPowerPairTool;
