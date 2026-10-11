import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gardenId: string;
  readonly plotCode: string;
  readonly seasonLabel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gardenId: { type: "string", maxLength: 8192, minLength: 1 },
    plotCode: { type: "string", maxLength: 8192, minLength: 1 },
    seasonLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["gardenId", "plotCode", "seasonLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous key from explicit garden, plot, and season labels without assigning land rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gardenId, plotCode, seasonLabel } = request;
  const compute = (): Output => {
    H.domain(gardenId.length > 0, "gardenId");
    H.domain(plotCode.length > 0, "plotCode");
    H.domain(seasonLabel.length > 0, "seasonLabel");
    return { token: JSON.stringify([gardenId, plotCode, seasonLabel]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gardenId: "G17", plotCode: "P2", seasonLabel: "2026-A" },
  output: { token: '["G17","P2","2026-A"]' },
} satisfies ToolExample<Input, Output>;
export const urbanGardenPlotKeyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/urban-garden-plot-key-token",
    title: "Urban Garden Plot Key Token",
    description:
      "Build an unambiguous key from explicit garden, plot, and season labels without assigning land rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gardenId: { type: "string", maxLength: 8192, minLength: 1 },
        plotCode: { type: "string", maxLength: 8192, minLength: 1 },
        seasonLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["gardenId", "plotCode", "seasonLabel"],
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
          id: "gardenId",
          label: "Garden Id",
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
          id: "seasonLabel",
          label: "Season Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = urbanGardenPlotKeyTokenTool.execute;
export default urbanGardenPlotKeyTokenTool;
