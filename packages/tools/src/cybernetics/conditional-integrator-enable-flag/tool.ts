import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly saturation: string;
  readonly proposedIntegratorChange: number;
};
export type Output = { readonly integrationEnabled: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saturation: {
      type: "string",
      maxLength: 8192,
      enum: ["none", "upper", "lower"],
    },
    proposedIntegratorChange: { type: "number" },
  },
  required: ["saturation", "proposedIntegratorChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integrationEnabled: { type: "boolean" } },
  required: ["integrationEnabled"],
} as const;
/** Permit an explicit integrator contribution change when unsaturated or when it does not drive the supplied saturation further outward. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { saturation, proposedIntegratorChange } = request;
  const compute = (): Output => {
    H.domain(["none", "upper", "lower"].includes(saturation), "saturation");
    return {
      integrationEnabled:
        saturation === "none" ||
        (saturation === "upper" && proposedIntegratorChange <= 0) ||
        (saturation === "lower" && proposedIntegratorChange >= 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { saturation: "upper", proposedIntegratorChange: 1 },
  output: { integrationEnabled: false },
} satisfies ToolExample<Input, Output>;
export const conditionalIntegratorEnableFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/conditional-integrator-enable-flag",
    title: "Conditional Integrator Enable Flag Tool",
    description:
      "Permit an explicit integrator contribution change when unsaturated or when it does not drive the supplied saturation further outward.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saturation: {
          type: "string",
          maxLength: 8192,
          enum: ["none", "upper", "lower"],
        },
        proposedIntegratorChange: { type: "number" },
      },
      required: ["saturation", "proposedIntegratorChange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integrationEnabled: { type: "boolean" } },
      required: ["integrationEnabled"],
    },
    ports: {
      inputs: [
        {
          id: "saturation",
          label: "Saturation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "proposedIntegratorChange",
          label: "Proposed Integrator Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "integrationEnabled",
          label: "Integration Enabled",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = conditionalIntegratorEnableFlagTool.execute;
export default conditionalIntegratorEnableFlagTool;
