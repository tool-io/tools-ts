import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedExports: number;
  readonly partnerReportedImports: number;
};
export type Output = {
  readonly importMinusExportGap: number;
  readonly symmetricRelativeGap: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedExports: { type: "number", minimum: 0 },
    partnerReportedImports: { type: "number", minimum: 0 },
  },
  required: ["reportedExports", "partnerReportedImports"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    importMinusExportGap: { type: "number" },
    symmetricRelativeGap: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["importMinusExportGap", "symmetricRelativeGap", "defined"],
} as const;
/** Compare explicit bilateral mirror trade values with a symmetric relative-gap convention without adjusting valuation or reporting periods. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedExports, partnerReportedImports } = request;
  const compute = (): Output => {
    H.domain(
      reportedExports >= 0 && partnerReportedImports >= 0,
      "reportedExports",
    );
    return (() => {
      const denominator =
        Math.abs(reportedExports) + Math.abs(partnerReportedImports);
      return {
        importMinusExportGap: partnerReportedImports - reportedExports,
        symmetricRelativeGap:
          denominator > 0
            ? (2 * (partnerReportedImports - reportedExports)) / denominator
            : 0,
        defined: denominator > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedExports: 100, partnerReportedImports: 120 },
  output: {
    importMinusExportGap: 20,
    symmetricRelativeGap: 0.18181818181818182,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const bilateralTradeMirrorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-economics",
        "international economics",
        "economics",
      ],
      keywords: ["international economics", "economics"],
    },
    id: "international-economics/bilateral-trade-mirror-gap",
    title: "Bilateral Trade Mirror Gap",
    description:
      "Compare explicit bilateral mirror trade values with a symmetric relative-gap convention without adjusting valuation or reporting periods.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedExports: { type: "number", minimum: 0 },
        partnerReportedImports: { type: "number", minimum: 0 },
      },
      required: ["reportedExports", "partnerReportedImports"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        importMinusExportGap: { type: "number" },
        symmetricRelativeGap: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["importMinusExportGap", "symmetricRelativeGap", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "reportedExports",
          label: "Reported Exports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partnerReportedImports",
          label: "Partner Reported Imports",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "importMinusExportGap",
          label: "Import Minus Export Gap",
          valueType: { type: "number" },
        },
        {
          id: "symmetricRelativeGap",
          label: "Symmetric Relative Gap",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = bilateralTradeMirrorGapTool.execute;
export default bilateralTradeMirrorGapTool;
