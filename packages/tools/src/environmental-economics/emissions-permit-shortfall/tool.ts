import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emissions: number;
  readonly heldPermits: number;
};
export type Output = { readonly shortfall: number; readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emissions: { type: "number", minimum: 0 },
    heldPermits: { type: "number", minimum: 0 },
  },
  required: ["emissions", "heldPermits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortfall: { type: "number" }, surplus: { type: "number" } },
  required: ["shortfall", "surplus"],
} as const;
/** Calculate emissions permit shortfall from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emissions, heldPermits } = request;
  const compute = (): Output => {
    H.domain(emissions >= 0 && heldPermits >= 0);
    return {
      shortfall: Math.max(0, emissions - heldPermits),
      surplus: Math.max(0, heldPermits - emissions),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { emissions: 120, heldPermits: 100 },
  output: { shortfall: 20, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const emissionsPermitShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/emissions-permit-shortfall",
    title: "Emissions Permit Shortfall Tool",
    description:
      "Calculate emissions permit shortfall from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emissions: { type: "number", minimum: 0 },
        heldPermits: { type: "number", minimum: 0 },
      },
      required: ["emissions", "heldPermits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "number" },
        surplus: { type: "number" },
      },
      required: ["shortfall", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "emissions",
          label: "Emissions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heldPermits",
          label: "Held Permits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = emissionsPermitShortfallTool.execute;
export default emissionsPermitShortfallTool;
