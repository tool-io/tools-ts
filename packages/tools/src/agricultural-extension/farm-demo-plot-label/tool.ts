import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly demonstrationId: string;
  readonly plotCode: string;
  readonly treatmentWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demonstrationId: { type: "string", maxLength: 8192, minLength: 1 },
    plotCode: { type: "string", maxLength: 8192, minLength: 1 },
    treatmentWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["demonstrationId", "plotCode", "treatmentWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit demonstration plot and treatment label without recommending treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demonstrationId, plotCode, treatmentWording } = request;
  const compute = (): Output => {
    H.domain(demonstrationId.length > 0, "demonstrationId");
    H.domain(plotCode.length > 0, "plotCode");
    H.domain(treatmentWording.length > 0, "treatmentWording");
    return {
      token: JSON.stringify([demonstrationId, plotCode, treatmentWording]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    demonstrationId: "DEMO17",
    plotCode: "P2",
    treatmentWording: "recorded treatment A",
  },
  output: { token: '["DEMO17","P2","recorded treatment A"]' },
} satisfies ToolExample<Input, Output>;
export const farmDemoPlotLabelTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/farm-demo-plot-label",
    title: "Farm Demo Plot Label",
    description:
      "Preserve an explicit demonstration plot and treatment label without recommending treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demonstrationId: { type: "string", maxLength: 8192, minLength: 1 },
        plotCode: { type: "string", maxLength: 8192, minLength: 1 },
        treatmentWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["demonstrationId", "plotCode", "treatmentWording"],
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
          id: "demonstrationId",
          label: "Demonstration Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "plotCode",
          label: "Plot Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "treatmentWording",
          label: "Treatment Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = farmDemoPlotLabelTool.execute;
export default farmDemoPlotLabelTool;
