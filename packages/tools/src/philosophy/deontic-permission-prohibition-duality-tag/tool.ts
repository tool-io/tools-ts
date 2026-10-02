import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly obligatoryNot: boolean };
export type Output = {
  readonly permitted: boolean;
  readonly prohibited: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { obligatoryNot: { type: "boolean" } },
  required: ["obligatoryNot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permitted: { type: "boolean" },
    prohibited: { type: "boolean" },
  },
  required: ["permitted", "prohibited"],
} as const;
/** Use weak permission P(a) = not O(not a), with prohibition defined as O(not a). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { obligatoryNot } = request;
  const compute = (): Output => {
    return { permitted: !obligatoryNot, prohibited: obligatoryNot };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { obligatoryNot: true },
  output: { permitted: false, prohibited: true },
} satisfies ToolExample<Input, Output>;
export const deonticPermissionProhibitionDualityTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "philosophy/deontic-permission-prohibition-duality-tag",
      title: "Deontic Permission Prohibition Duality Tag Tool",
      description:
        "Use weak permission P(a) = not O(not a), with prohibition defined as O(not a).",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { obligatoryNot: { type: "boolean" } },
        required: ["obligatoryNot"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          permitted: { type: "boolean" },
          prohibited: { type: "boolean" },
        },
        required: ["permitted", "prohibited"],
      },
      ports: {
        inputs: [
          {
            id: "obligatoryNot",
            label: "Obligatory Not",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "permitted",
            label: "Permitted",
            valueType: { type: "boolean" },
          },
          {
            id: "prohibited",
            label: "Prohibited",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = deonticPermissionProhibitionDualityTagTool.execute;
export default deonticPermissionProhibitionDualityTagTool;
