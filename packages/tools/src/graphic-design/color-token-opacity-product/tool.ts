import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokenAlpha: number;
  readonly groupOpacity: number;
};
export type Output = { readonly effectiveAlpha: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenAlpha: { type: "number", minimum: 0, maximum: 1 },
    groupOpacity: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["tokenAlpha", "groupOpacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveAlpha: { type: "number" } },
  required: ["effectiveAlpha"],
} as const;
/** Multiply one supplied color alpha by group opacity; this is not a complete compositing operation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokenAlpha, groupOpacity } = request;
  const compute = (): Output => {
    H.probability(tokenAlpha);
    H.probability(groupOpacity);
    return { effectiveAlpha: tokenAlpha * groupOpacity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokenAlpha: 0.5, groupOpacity: 0.4 },
  output: { effectiveAlpha: 0.2 },
} satisfies ToolExample<Input, Output>;
export const colorTokenOpacityProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/color-token-opacity-product",
    title: "Color Token Opacity Product Tool",
    description:
      "Multiply one supplied color alpha by group opacity; this is not a complete compositing operation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenAlpha: { type: "number", minimum: 0, maximum: 1 },
        groupOpacity: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["tokenAlpha", "groupOpacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveAlpha: { type: "number" } },
      required: ["effectiveAlpha"],
    },
    ports: {
      inputs: [
        {
          id: "tokenAlpha",
          label: "Token Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groupOpacity",
          label: "Group Opacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveAlpha",
          label: "Effective Alpha",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = colorTokenOpacityProductTool.execute;
export default colorTokenOpacityProductTool;
