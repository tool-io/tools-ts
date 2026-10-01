import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outcomeLabel: string;
  readonly priorLabels: readonly string[];
  readonly registrationKnown: boolean;
};
export type Output = {
  readonly listedPreviously: boolean;
  readonly provenanceKnown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outcomeLabel: { type: "string", maxLength: 8192 },
    priorLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    registrationKnown: { type: "boolean" },
  },
  required: ["outcomeLabel", "priorLabels", "registrationKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listedPreviously: { type: "boolean" },
    provenanceKnown: { type: "boolean" },
  },
  required: ["listedPreviously", "provenanceKnown"],
} as const;
/** Compare exact research outcome labels against a supplied prior list without evaluating intervention effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outcomeLabel, priorLabels, registrationKnown } = request;
  const compute = (): Output => {
    return {
      listedPreviously: registrationKnown && priorLabels.includes(outcomeLabel),
      provenanceKnown: registrationKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outcomeLabel: "pain",
    priorLabels: ["pain", "function"],
    registrationKnown: true,
  },
  output: { listedPreviously: true, provenanceKnown: true },
} satisfies ToolExample<Input, Output>;
export const trialOutcomePriorLabelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/trial-outcome-prior-label-token",
    title: "Trial Outcome Prior Label Token Tool",
    description:
      "Compare exact research outcome labels against a supplied prior list without evaluating intervention effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outcomeLabel: { type: "string", maxLength: 8192 },
        priorLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        registrationKnown: { type: "boolean" },
      },
      required: ["outcomeLabel", "priorLabels", "registrationKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listedPreviously: { type: "boolean" },
        provenanceKnown: { type: "boolean" },
      },
      required: ["listedPreviously", "provenanceKnown"],
    },
    ports: {
      inputs: [
        {
          id: "outcomeLabel",
          label: "Outcome Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "priorLabels",
          label: "Prior Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "registrationKnown",
          label: "Registration Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "listedPreviously",
          label: "Listed Previously",
          valueType: { type: "boolean" },
        },
        {
          id: "provenanceKnown",
          label: "Provenance Known",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialOutcomePriorLabelTokenTool.execute;
export default trialOutcomePriorLabelTokenTool;
