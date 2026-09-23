import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly touches: readonly string[];
  readonly targetIndex: number;
  readonly value: number;
  readonly rule: string;
};
export type Output = { readonly credit: number; readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    touches: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetIndex: { type: "integer", minimum: 0 },
    value: { type: "number" },
    rule: { type: "string", maxLength: 8192, enum: ["first", "last", "equal"] },
  },
  required: ["touches", "targetIndex", "value", "rule"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { credit: { type: "number" }, weight: { type: "number" } },
  required: ["credit", "weight"],
} as const;
/** Attribute one indexed touch under an explicit first, last or equal-touch rule; repeated channel IDs remain separate touches. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { touches, targetIndex, value, rule } = request;
  const compute = (): Output => {
    H.integer(targetIndex, 0, touches.length - 1);
    H.domain(["first", "last", "equal"].includes(rule));
    const weight =
      rule === "equal"
        ? 1 / touches.length
        : rule === "first"
          ? Number(targetIndex === 0)
          : Number(targetIndex === touches.length - 1);
    return { credit: value * weight, weight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { touches: ["A", "B", "A"], targetIndex: 1, value: 90, rule: "equal" },
  output: { credit: 30, weight: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const conversionPathOneTouchCreditRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/conversion-path-one-touch-credit-rule",
    title: "Conversion Path One Touch Credit Rule Tool",
    description:
      "Attribute one indexed touch under an explicit first, last or equal-touch rule; repeated channel IDs remain separate touches.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        touches: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targetIndex: { type: "integer", minimum: 0 },
        value: { type: "number" },
        rule: {
          type: "string",
          maxLength: 8192,
          enum: ["first", "last", "equal"],
        },
      },
      required: ["touches", "targetIndex", "value", "rule"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { credit: { type: "number" }, weight: { type: "number" } },
      required: ["credit", "weight"],
    },
    ports: {
      inputs: [
        {
          id: "touches",
          label: "Touches",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targetIndex",
          label: "Target Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rule",
          label: "Rule",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "credit", label: "Credit", valueType: { type: "number" } },
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = conversionPathOneTouchCreditRuleTool.execute;
export default conversionPathOneTouchCreditRuleTool;
