import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly allowed: readonly boolean[] };
export type Output = {
  readonly allowedCount: number;
  readonly density: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["allowed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowedCount: { type: "integer" },
    density: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["allowedCount", "density", "defined"],
} as const;
/** Calculate attention row mask density from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allowed } = request;
  const compute = (): Output => {
    return {
      allowedCount: allowed.filter(Boolean).length,
      density: allowed.length
        ? allowed.filter(Boolean).length / allowed.length
        : 0,
      defined: allowed.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allowed: [true, false, true, false] },
  output: { allowedCount: 2, density: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const attentionRowMaskDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/attention-row-mask-density",
    title: "Attention Row Mask Density Tool",
    description:
      "Calculate attention row mask density from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowed: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["allowed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowedCount: { type: "integer" },
        density: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["allowedCount", "density", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "allowed",
          label: "Allowed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "allowedCount",
          label: "Allowed Count",
          valueType: { type: "integer" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = attentionRowMaskDensityTool.execute;
export default attentionRowMaskDensityTool;
