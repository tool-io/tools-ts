import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossExports: number;
  readonly reexports: number;
};
export type Output = {
  readonly domesticExports: number;
  readonly reexportFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossExports: { type: "number", minimum: 0 },
    reexports: { type: "number", minimum: 0 },
  },
  required: ["grossExports", "reexports"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domesticExports: { type: "number" },
    reexportFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["domesticExports", "reexportFraction", "defined"],
} as const;
/** Remove explicitly reported reexports from compatible gross exports without estimating domestic value added. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossExports, reexports } = request;
  const compute = (): Output => {
    H.domain(
      grossExports >= 0 && reexports >= 0 && reexports <= grossExports,
      "grossExports",
    );
    return {
      domesticExports: grossExports - reexports,
      reexportFraction: grossExports > 0 ? reexports / grossExports : 0,
      defined: grossExports > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossExports: 100, reexports: 30 },
  output: { domesticExports: 70, reexportFraction: 0.3, defined: true },
} satisfies ToolExample<Input, Output>;
export const internationalFlowReexportAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["global-studies", "global studies", "social sciences"],
        keywords: ["global studies", "social sciences"],
      },
      id: "global-studies/international-flow-reexport-adjustment",
      title: "International Flow Reexport Adjustment",
      description:
        "Remove explicitly reported reexports from compatible gross exports without estimating domestic value added.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossExports: { type: "number", minimum: 0 },
          reexports: { type: "number", minimum: 0 },
        },
        required: ["grossExports", "reexports"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          domesticExports: { type: "number" },
          reexportFraction: { type: "number" },
          defined: { type: "boolean" },
        },
        required: ["domesticExports", "reexportFraction", "defined"],
      },
      ports: {
        inputs: [
          {
            id: "grossExports",
            label: "Gross Exports",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reexports",
            label: "Reexports",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "domesticExports",
            label: "Domestic Exports",
            valueType: { type: "number" },
          },
          {
            id: "reexportFraction",
            label: "Reexport Fraction",
            valueType: { type: "number" },
          },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = internationalFlowReexportAdjustmentTool.execute;
export default internationalFlowReexportAdjustmentTool;
