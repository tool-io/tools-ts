import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelId: string;
  readonly analyteId: string;
  readonly resultText: string;
  readonly suppliedCensorCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelId: { type: "string", maxLength: 8192, minLength: 1 },
    analyteId: { type: "string", maxLength: 8192, minLength: 1 },
    resultText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["panelId", "analyteId", "resultText", "suppliedCensorCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit cytokine panel analyte result and censoring metadata without substitution or interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelId, analyteId, resultText, suppliedCensorCode } = request;
  const compute = (): Output => {
    H.domain(panelId.length > 0, "panelId");
    H.domain(analyteId.length > 0, "analyteId");
    H.domain(resultText.length > 0, "resultText");
    H.domain(suppliedCensorCode.length > 0, "suppliedCensorCode");
    return {
      token: JSON.stringify([
        panelId,
        analyteId,
        resultText,
        suppliedCensorCode,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    panelId: "P17",
    analyteId: "A4",
    resultText: "<0.2",
    suppliedCensorCode: "left",
  },
  output: { token: '["P17","A4","<0.2","left"]' },
} satisfies ToolExample<Input, Output>;
export const cytokinePanelCensoredResultFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/cytokine-panel-censored-result-field",
    title: "Cytokine Panel Censored Result Field Tool",
    description:
      "Preserve explicit cytokine panel analyte result and censoring metadata without substitution or interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelId: { type: "string", maxLength: 8192, minLength: 1 },
        analyteId: { type: "string", maxLength: 8192, minLength: 1 },
        resultText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["panelId", "analyteId", "resultText", "suppliedCensorCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "panelId",
          label: "Panel Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "analyteId",
          label: "Analyte Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "resultText",
          label: "Result Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCensorCode",
          label: "Supplied Censor Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cytokinePanelCensoredResultFieldTool.execute;
export default cytokinePanelCensoredResultFieldTool;
