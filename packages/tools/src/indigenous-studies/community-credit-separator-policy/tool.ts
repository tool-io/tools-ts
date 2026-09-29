import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly credits: readonly string[];
  readonly separator: string;
};
export type Output = { readonly formatted: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    credits: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["credits", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formatted: { type: "string", maxLength: 8192 } },
  required: ["formatted"],
} as const;
/** Join supplied community credits under an explicit separator policy without normalizing names. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { credits, separator } = request;
  const compute = (): Output => {
    H.domain(!/[\r\n]/.test(separator));
    return { formatted: credits.join(separator) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { credits: ["Community A", "Community B"], separator: "; " },
  output: { formatted: "Community A; Community B" },
} satisfies ToolExample<Input, Output>;
export const communityCreditSeparatorPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/community-credit-separator-policy",
    title: "Community Credit Separator Policy Tool",
    description:
      "Join supplied community credits under an explicit separator policy without normalizing names.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        credits: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["credits", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { formatted: { type: "string", maxLength: 8192 } },
      required: ["formatted"],
    },
    ports: {
      inputs: [
        {
          id: "credits",
          label: "Credits",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "formatted", label: "Formatted", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = communityCreditSeparatorPolicyTool.execute;
export default communityCreditSeparatorPolicyTool;
