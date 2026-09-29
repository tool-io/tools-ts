import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentValues: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly proposedValues: number;
};
export type Output = {
  readonly after: number;
  readonly missing: number;
  readonly excess: number;
  readonly within: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentValues: { type: "integer", minimum: 0 },
    minimum: { type: "integer", minimum: 0 },
    maximum: { type: "integer" },
    proposedValues: { type: "integer", minimum: 0 },
  },
  required: ["presentValues", "minimum", "maximum", "proposedValues"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    after: { type: "integer" },
    missing: { type: "integer" },
    excess: { type: "integer" },
    within: { type: "boolean" },
  },
  required: ["after", "missing", "excess", "within"],
} as const;
/** Calculate metadata cardinality one property budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentValues, minimum, maximum, proposedValues } = request;
  const compute = (): Output => {
    H.integer(presentValues, 0);
    H.integer(minimum, 0);
    H.integer(maximum, minimum);
    H.integer(proposedValues, 0);
    return {
      after: presentValues + proposedValues,
      missing: Math.max(0, minimum - presentValues - proposedValues),
      excess: Math.max(0, presentValues + proposedValues - maximum),
      within:
        presentValues + proposedValues >= minimum &&
        presentValues + proposedValues <= maximum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentValues: 2, minimum: 1, maximum: 3, proposedValues: 2 },
  output: { after: 4, missing: 0, excess: 1, within: false },
} satisfies ToolExample<Input, Output>;
export const metadataCardinalityOnePropertyBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information-science/metadata-cardinality-one-property-budget",
      title: "Metadata Cardinality One Property Budget Tool",
      description:
        "Calculate metadata cardinality one property budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          presentValues: { type: "integer", minimum: 0 },
          minimum: { type: "integer", minimum: 0 },
          maximum: { type: "integer" },
          proposedValues: { type: "integer", minimum: 0 },
        },
        required: ["presentValues", "minimum", "maximum", "proposedValues"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          after: { type: "integer" },
          missing: { type: "integer" },
          excess: { type: "integer" },
          within: { type: "boolean" },
        },
        required: ["after", "missing", "excess", "within"],
      },
      ports: {
        inputs: [
          {
            id: "presentValues",
            label: "Present Values",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "maximum",
            label: "Maximum",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "proposedValues",
            label: "Proposed Values",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "after", label: "After", valueType: { type: "integer" } },
          { id: "missing", label: "Missing", valueType: { type: "integer" } },
          { id: "excess", label: "Excess", valueType: { type: "integer" } },
          { id: "within", label: "Within", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = metadataCardinalityOnePropertyBudgetTool.execute;
export default metadataCardinalityOnePropertyBudgetTool;
