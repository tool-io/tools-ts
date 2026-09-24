import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstBeta: number; readonly secondBeta: number };
export type Output = {
  readonly composedBeta: number;
  readonly additiveGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstBeta: { type: "number" }, secondBeta: { type: "number" } },
  required: ["firstBeta", "secondBeta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    composedBeta: { type: "number" },
    additiveGap: { type: "number" },
  },
  required: ["composedBeta", "additiveGap"],
} as const;
/** Collinear special-relativistic beta composition only, not a cosmological redshift-to-recession-velocity conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBeta, secondBeta } = request;
  const compute = (): Output => {
    H.domain(Math.abs(firstBeta) < 1 && Math.abs(secondBeta) < 1);
    return {
      composedBeta: (firstBeta + secondBeta) / (1 + firstBeta * secondBeta),
      additiveGap:
        (firstBeta + secondBeta) / (1 + firstBeta * secondBeta) -
        firstBeta -
        secondBeta,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstBeta: 0.5, secondBeta: 0.5 },
  output: { composedBeta: 0.8, additiveGap: -0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const redshiftVelocityCompositionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/redshift-velocity-composition-gap",
    title: "Redshift Velocity Composition Gap Tool",
    description:
      "Collinear special-relativistic beta composition only, not a cosmological redshift-to-recession-velocity conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBeta: { type: "number" },
        secondBeta: { type: "number" },
      },
      required: ["firstBeta", "secondBeta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        composedBeta: { type: "number" },
        additiveGap: { type: "number" },
      },
      required: ["composedBeta", "additiveGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstBeta",
          label: "First Beta",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBeta",
          label: "Second Beta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "composedBeta",
          label: "Composed Beta",
          valueType: { type: "number" },
        },
        {
          id: "additiveGap",
          label: "Additive Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = redshiftVelocityCompositionGapTool.execute;
export default redshiftVelocityCompositionGapTool;
