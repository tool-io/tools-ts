import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completedPregnancies: number;
  readonly ongoing: boolean;
  readonly includeOngoing: boolean;
  readonly definition: string;
};
export type Output = {
  readonly count: number;
  readonly includesCurrent: boolean;
  readonly definition: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedPregnancies: { type: "integer", minimum: 0 },
    ongoing: { type: "boolean" },
    includeOngoing: { type: "boolean" },
    definition: { type: "string", maxLength: 8192 },
  },
  required: ["completedPregnancies", "ongoing", "includeOngoing", "definition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer" },
    includesCurrent: { type: "boolean" },
    definition: { type: "string", maxLength: 8192 },
  },
  required: ["count", "includesCurrent", "definition"],
} as const;
/** Count supplied records under an explicit study definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completedPregnancies, ongoing, includeOngoing, definition } = request;
  const compute = (): Output => {
    H.integer(completedPregnancies, 0);
    H.domain(definition.length > 0, "definition");
    return {
      count: completedPregnancies + (ongoing && includeOngoing ? 1 : 0),
      includesCurrent: ongoing && includeOngoing,
      definition,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    completedPregnancies: 2,
    ongoing: true,
    includeOngoing: true,
    definition: "study-A-v1",
  },
  output: { count: 3, includesCurrent: true, definition: "study-A-v1" },
} satisfies ToolExample<Input, Output>;
export const obstetricResearchPregnancyCountDefinitionTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "obstetrics/obstetric-research-pregnancy-count-definition-tag",
      title: "Obstetric Research Pregnancy Count Definition Tag Tool",
      description: "Count supplied records under an explicit study definition.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          completedPregnancies: { type: "integer", minimum: 0 },
          ongoing: { type: "boolean" },
          includeOngoing: { type: "boolean" },
          definition: { type: "string", maxLength: 8192 },
        },
        required: [
          "completedPregnancies",
          "ongoing",
          "includeOngoing",
          "definition",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "integer" },
          includesCurrent: { type: "boolean" },
          definition: { type: "string", maxLength: 8192 },
        },
        required: ["count", "includesCurrent", "definition"],
      },
      ports: {
        inputs: [
          {
            id: "completedPregnancies",
            label: "Completed Pregnancies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "ongoing",
            label: "Ongoing",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "includeOngoing",
            label: "Include Ongoing",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "definition",
            label: "Definition",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "count", label: "Count", valueType: { type: "integer" } },
          {
            id: "includesCurrent",
            label: "Includes Current",
            valueType: { type: "boolean" },
          },
          {
            id: "definition",
            label: "Definition",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = obstetricResearchPregnancyCountDefinitionTagTool.execute;
export default obstetricResearchPregnancyCountDefinitionTagTool;
