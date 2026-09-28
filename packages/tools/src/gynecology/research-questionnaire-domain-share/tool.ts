import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly domainItems: number;
  readonly includedItems: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domainItems: { type: "integer", minimum: 0 },
    includedItems: { type: "integer", minimum: 0 },
  },
  required: ["domainItems", "includedItems"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Report supplied research item counts without a questionnaire score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { domainItems, includedItems } = request;
  const compute = (): Output => {
    H.integer(includedItems, 0);
    H.integer(domainItems, 0, includedItems);
    return {
      share: includedItems > 0 ? domainItems / includedItems : 0,
      defined: includedItems > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { domainItems: 3, includedItems: 12 },
  output: { share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchQuestionnaireDomainShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/research-questionnaire-domain-share",
    title: "Research Questionnaire Domain Share Tool",
    description:
      "Report supplied research item counts without a questionnaire score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domainItems: { type: "integer", minimum: 0 },
        includedItems: { type: "integer", minimum: 0 },
      },
      required: ["domainItems", "includedItems"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "domainItems",
          label: "Domain Items",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includedItems",
          label: "Included Items",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchQuestionnaireDomainShareTool.execute;
export default researchQuestionnaireDomainShareTool;
