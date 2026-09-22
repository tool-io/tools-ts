import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly providedLength: number;
  readonly suppliedRequiredLength: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    providedLength: { type: "number", minimum: 0 },
    suppliedRequiredLength: { type: "number", minimum: 0 },
  },
  required: ["providedLength", "suppliedRequiredLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compare a measured landing length with an explicit requirement without selecting a building-code threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { providedLength, suppliedRequiredLength } = request;
  const compute = (): Output => {
    H.domain(providedLength >= 0 && suppliedRequiredLength >= 0);
    return { residual: providedLength - suppliedRequiredLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { providedLength: 2, suppliedRequiredLength: 1.5 },
  output: { residual: 0.5 },
} satisfies ToolExample<Input, Output>;
export const rampLandingLengthResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/ramp-landing-length-residual",
    title: "Ramp Landing Length Residual Tool",
    description:
      "Compare a measured landing length with an explicit requirement without selecting a building-code threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        providedLength: { type: "number", minimum: 0 },
        suppliedRequiredLength: { type: "number", minimum: 0 },
      },
      required: ["providedLength", "suppliedRequiredLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    ports: {
      inputs: [
        {
          id: "providedLength",
          label: "Provided Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRequiredLength",
          label: "Supplied Required Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rampLandingLengthResidualTool.execute;
export default rampLandingLengthResidualTool;
