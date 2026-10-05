import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly index: number };
export type Output = { readonly weightDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer", minimum: 0, maximum: 4096 } },
  required: ["index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["weightDecimal"],
} as const;
/** Return the exact binary subset-encoding weight 2^index for one zero-based set element, capped at index 4096. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(index) && index >= 0 && index <= 4096,
      "index",
    ),
      index);
    return { weightDecimal: (1n << BigInt(index)).toString() };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 7 },
  output: { weightDecimal: "128" },
} satisfies ToolExample<Input, Output>;
export const setElementPowerWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-element-power-weight",
    title: "Set Element Power Weight Tool",
    description:
      "Return the exact binary subset-encoding weight 2^index for one zero-based set element, capped at index 4096.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer", minimum: 0, maximum: 4096 } },
      required: ["index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["weightDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "weightDecimal",
          label: "Weight Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = setElementPowerWeightTool.execute;
export default setElementPowerWeightTool;
