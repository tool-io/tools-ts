import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly suppliedActivityCoefficient: number;
};
export type Output = { readonly effectiveConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    suppliedActivityCoefficient: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "suppliedActivityCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveConcentration: { type: "number" } },
  required: ["effectiveConcentration"],
} as const;
/** Apply a supplied positive activity coefficient to concentration on the same reference basis without predicting osmotic pressure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, suppliedActivityCoefficient } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0, "concentration");
    (H.domain(
      Number.isFinite(suppliedActivityCoefficient) &&
        suppliedActivityCoefficient > 0,
      "suppliedActivityCoefficient",
    ),
      suppliedActivityCoefficient);
    return {
      effectiveConcentration: concentration * suppliedActivityCoefficient,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 0.2, suppliedActivityCoefficient: 0.8 },
  output: { effectiveConcentration: 0.16000000000000003 },
} satisfies ToolExample<Input, Output>;
export const osmosisConcentrationActivityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/osmosis-concentration-activity-term",
    title: "Osmosis Concentration Activity Term",
    description:
      "Apply a supplied positive activity coefficient to concentration on the same reference basis without predicting osmotic pressure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        suppliedActivityCoefficient: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["concentration", "suppliedActivityCoefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveConcentration: { type: "number" } },
      required: ["effectiveConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedActivityCoefficient",
          label: "Supplied Activity Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveConcentration",
          label: "Effective Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = osmosisConcentrationActivityTermTool.execute;
export default osmosisConcentrationActivityTermTool;
