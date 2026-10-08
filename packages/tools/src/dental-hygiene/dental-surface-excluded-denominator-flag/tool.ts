import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: boolean;
  readonly excludedByProtocol: boolean;
};
export type Output = { readonly includedInDenominator: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "boolean" },
    excludedByProtocol: { type: "boolean" },
  },
  required: ["observed", "excludedByProtocol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { includedInDenominator: { type: "boolean" } },
  required: ["includedInDenominator"],
} as const;
/** Combine explicit observed and protocol-excluded flags for one dental-surface denominator without selecting a scoring protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, excludedByProtocol } = request;
  const compute = (): Output => {
    return { includedInDenominator: observed && !excludedByProtocol };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: true, excludedByProtocol: false },
  output: { includedInDenominator: true },
} satisfies ToolExample<Input, Output>;
export const dentalSurfaceExcludedDenominatorFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
        keywords: ["dental hygiene", "health and medicine"],
      },
      id: "dental-hygiene/dental-surface-excluded-denominator-flag",
      title: "Dental Surface Excluded Denominator Flag",
      description:
        "Combine explicit observed and protocol-excluded flags for one dental-surface denominator without selecting a scoring protocol.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "boolean" },
          excludedByProtocol: { type: "boolean" },
        },
        required: ["observed", "excludedByProtocol"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { includedInDenominator: { type: "boolean" } },
        required: ["includedInDenominator"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "excludedByProtocol",
            label: "Excluded By Protocol",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "includedInDenominator",
            label: "Included In Denominator",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dentalSurfaceExcludedDenominatorFlagTool.execute;
export default dentalSurfaceExcludedDenominatorFlagTool;
