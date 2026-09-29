import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedUnit: string;
  readonly referenceUnit: string;
  readonly conversionKnown: boolean;
};
export type Output = {
  readonly sameUnit: boolean;
  readonly comparable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedUnit: { type: "string", maxLength: 8192 },
    referenceUnit: { type: "string", maxLength: 8192 },
    conversionKnown: { type: "boolean" },
  },
  required: ["recordedUnit", "referenceUnit", "conversionKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameUnit: { type: "boolean" },
    comparable: { type: "boolean" },
  },
  required: ["sameUnit", "comparable"],
} as const;
/** Flag supplied price-unit comparability without inventing a historical unit conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedUnit, referenceUnit, conversionKnown } = request;
  const compute = (): Output => {
    const sameUnit = recordedUnit === referenceUnit;
    H.domain(recordedUnit.length > 0 && referenceUnit.length > 0);
    return { sameUnit, comparable: sameUnit || conversionKnown };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedUnit: "bushel-local",
    referenceUnit: "bushel-standard",
    conversionKnown: false,
  },
  output: { sameUnit: false, comparable: false },
} satisfies ToolExample<Input, Output>;
export const historicalPriceUnitReferenceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-price-unit-reference-flag",
    title: "Historical Price Unit Reference Flag Tool",
    description:
      "Flag supplied price-unit comparability without inventing a historical unit conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedUnit: { type: "string", maxLength: 8192 },
        referenceUnit: { type: "string", maxLength: 8192 },
        conversionKnown: { type: "boolean" },
      },
      required: ["recordedUnit", "referenceUnit", "conversionKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameUnit: { type: "boolean" },
        comparable: { type: "boolean" },
      },
      required: ["sameUnit", "comparable"],
    },
    ports: {
      inputs: [
        {
          id: "recordedUnit",
          label: "Recorded Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceUnit",
          label: "Reference Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conversionKnown",
          label: "Conversion Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "sameUnit", label: "Same Unit", valueType: { type: "boolean" } },
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalPriceUnitReferenceFlagTool.execute;
export default historicalPriceUnitReferenceFlagTool;
