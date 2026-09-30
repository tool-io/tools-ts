import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly infantCoordinate: number;
  readonly parentCoordinate: number;
  readonly referenceDifference: number;
};
export type Output = { readonly difference: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    infantCoordinate: { type: "number", minimum: 0 },
    parentCoordinate: { type: "number", minimum: 0 },
    referenceDifference: { type: "number" },
  },
  required: ["infantCoordinate", "parentCoordinate", "referenceDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" }, residual: { type: "number" } },
  required: ["difference", "residual"],
} as const;
/** Compare supplied research age coordinates on the same unit basis without inferring identities or risk. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { infantCoordinate, parentCoordinate, referenceDifference } = request;
  const compute = (): Output => {
    H.domain(infantCoordinate >= 0 && parentCoordinate >= 0);
    return {
      difference: parentCoordinate - infantCoordinate,
      residual: parentCoordinate - infantCoordinate - referenceDifference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { infantCoordinate: 2, parentCoordinate: 30, referenceDifference: 25 },
  output: { difference: 28, residual: 3 },
} satisfies ToolExample<Input, Output>;
export const infantParentAgeReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/infant-parent-age-reference-gap",
    title: "Infant Parent Age Reference Gap Tool",
    description:
      "Compare supplied research age coordinates on the same unit basis without inferring identities or risk.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        infantCoordinate: { type: "number", minimum: 0 },
        parentCoordinate: { type: "number", minimum: 0 },
        referenceDifference: { type: "number" },
      },
      required: ["infantCoordinate", "parentCoordinate", "referenceDifference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        residual: { type: "number" },
      },
      required: ["difference", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "infantCoordinate",
          label: "Infant Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parentCoordinate",
          label: "Parent Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDifference",
          label: "Reference Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = infantParentAgeReferenceGapTool.execute;
export default infantParentAgeReferenceGapTool;
