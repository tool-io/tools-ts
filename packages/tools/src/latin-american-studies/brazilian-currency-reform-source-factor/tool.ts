import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldAmount: number;
  readonly oldUnitsPerNewUnit: number;
  readonly oldUnit: string;
  readonly newUnit: string;
  readonly source: string;
};
export type Output = {
  readonly newAmount: number;
  readonly factorLabel: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldAmount: { type: "number" },
    oldUnitsPerNewUnit: { type: "number", exclusiveMinimum: 0 },
    oldUnit: { type: "string", maxLength: 8192 },
    newUnit: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["oldAmount", "oldUnitsPerNewUnit", "oldUnit", "newUnit", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newAmount: { type: "number" },
    factorLabel: { type: "string", maxLength: 8192 },
  },
  required: ["newAmount", "factorLabel"],
} as const;
/** Apply a caller-supplied sourced historical currency redenomination factor; no reform date or factual factor is embedded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldAmount, oldUnitsPerNewUnit, oldUnit, newUnit, source } = request;
  const compute = (): Output => {
    (H.domain(oldUnitsPerNewUnit > 0, "oldUnitsPerNewUnit"),
      oldUnitsPerNewUnit);
    H.domain(
      oldUnit.length > 0 && newUnit.length > 0 && source.length > 0,
      "oldUnit",
    );
    return {
      newAmount: oldAmount / oldUnitsPerNewUnit,
      factorLabel:
        oldUnitsPerNewUnit +
        " " +
        oldUnit +
        " = 1 " +
        newUnit +
        " [" +
        source +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldAmount: 1000,
    oldUnitsPerNewUnit: 1000,
    oldUnit: "old unit",
    newUnit: "new unit",
    source: "source record",
  },
  output: {
    newAmount: 1,
    factorLabel: "1000 old unit = 1 new unit [source record]",
  },
} satisfies ToolExample<Input, Output>;
export const brazilianCurrencyReformSourceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "latin-american-studies/brazilian-currency-reform-source-factor",
      title: "Brazilian Currency Reform Source Factor Tool",
      description:
        "Apply a caller-supplied sourced historical currency redenomination factor; no reform date or factual factor is embedded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldAmount: { type: "number" },
          oldUnitsPerNewUnit: { type: "number", exclusiveMinimum: 0 },
          oldUnit: { type: "string", maxLength: 8192 },
          newUnit: { type: "string", maxLength: 8192 },
          source: { type: "string", maxLength: 8192 },
        },
        required: [
          "oldAmount",
          "oldUnitsPerNewUnit",
          "oldUnit",
          "newUnit",
          "source",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          newAmount: { type: "number" },
          factorLabel: { type: "string", maxLength: 8192 },
        },
        required: ["newAmount", "factorLabel"],
      },
      ports: {
        inputs: [
          {
            id: "oldAmount",
            label: "Old Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldUnitsPerNewUnit",
            label: "Old Units Per New Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldUnit",
            label: "Old Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "newUnit",
            label: "New Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "newAmount",
            label: "New Amount",
            valueType: { type: "number" },
          },
          {
            id: "factorLabel",
            label: "Factor Label",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = brazilianCurrencyReformSourceFactorTool.execute;
export default brazilianCurrencyReformSourceFactorTool;
