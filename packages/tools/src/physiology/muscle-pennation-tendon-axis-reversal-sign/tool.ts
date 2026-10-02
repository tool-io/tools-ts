import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fiberForce: number;
  readonly cosinePennation: number;
  readonly tendonAxisReversed: boolean;
};
export type Output = { readonly signedTendonComponent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fiberForce: { type: "number", minimum: 0 },
    cosinePennation: { type: "number", minimum: -1, maximum: 1 },
    tendonAxisReversed: { type: "boolean" },
  },
  required: ["fiberForce", "cosinePennation", "tendonAxisReversed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedTendonComponent: { type: "number" } },
  required: ["signedTendonComponent"],
} as const;
/** Project a supplied fiber force using the supplied pennation cosine and explicit tendon-axis orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fiberForce, cosinePennation, tendonAxisReversed } = request;
  const compute = (): Output => {
    H.domain(fiberForce >= 0 && cosinePennation >= -1 && cosinePennation <= 1);
    return {
      signedTendonComponent:
        fiberForce * cosinePennation * (tendonAxisReversed ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fiberForce: 100, cosinePennation: 0.8, tendonAxisReversed: true },
  output: { signedTendonComponent: -80 },
} satisfies ToolExample<Input, Output>;
export const musclePennationTendonAxisReversalSignTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiology/muscle-pennation-tendon-axis-reversal-sign",
      title: "Muscle Pennation Tendon Axis Reversal Sign Tool",
      description:
        "Project a supplied fiber force using the supplied pennation cosine and explicit tendon-axis orientation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fiberForce: { type: "number", minimum: 0 },
          cosinePennation: { type: "number", minimum: -1, maximum: 1 },
          tendonAxisReversed: { type: "boolean" },
        },
        required: ["fiberForce", "cosinePennation", "tendonAxisReversed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedTendonComponent: { type: "number" } },
        required: ["signedTendonComponent"],
      },
      ports: {
        inputs: [
          {
            id: "fiberForce",
            label: "Fiber Force",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cosinePennation",
            label: "Cosine Pennation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tendonAxisReversed",
            label: "Tendon Axis Reversed",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "signedTendonComponent",
            label: "Signed Tendon Component",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = musclePennationTendonAxisReversalSignTool.execute;
export default musclePennationTendonAxisReversalSignTool;
