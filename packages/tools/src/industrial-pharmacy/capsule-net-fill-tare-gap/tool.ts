import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly shellTare: number;
  readonly referenceFill: number;
};
export type Output = { readonly netFill: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    shellTare: { type: "number", minimum: 0 },
    referenceFill: { type: "number", minimum: 0 },
  },
  required: ["grossMass", "shellTare", "referenceFill"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netFill: { type: "number" }, gap: { type: "number" } },
  required: ["netFill", "gap"],
} as const;
/** Supplied bench mass accounting only, without formulation or release specifications. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, shellTare, referenceFill } = request;
  const compute = (): Output => {
    H.domain(
      grossMass >= 0 &&
        shellTare >= 0 &&
        shellTare <= grossMass &&
        referenceFill >= 0,
    );
    return {
      netFill: grossMass - shellTare,
      gap: grossMass - shellTare - referenceFill,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 120, shellTare: 20, referenceFill: 95 },
  output: { netFill: 100, gap: 5 },
} satisfies ToolExample<Input, Output>;
export const capsuleNetFillTareGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/capsule-net-fill-tare-gap",
    title: "Capsule Net Fill Tare Gap Tool",
    description:
      "Supplied bench mass accounting only, without formulation or release specifications.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        shellTare: { type: "number", minimum: 0 },
        referenceFill: { type: "number", minimum: 0 },
      },
      required: ["grossMass", "shellTare", "referenceFill"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netFill: { type: "number" }, gap: { type: "number" } },
      required: ["netFill", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shellTare",
          label: "Shell Tare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFill",
          label: "Reference Fill",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netFill", label: "Net Fill", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = capsuleNetFillTareGapTool.execute;
export default capsuleNetFillTareGapTool;
