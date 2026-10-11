import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visibleIndividuals: number;
  readonly recordedGroupSize: number;
};
export type Output = {
  readonly visibleFraction: number;
  readonly unseenCount: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleIndividuals: { type: "integer", minimum: 0 },
    recordedGroupSize: { type: "integer", minimum: 0 },
  },
  required: ["visibleIndividuals", "recordedGroupSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleFraction: { type: "number" },
    unseenCount: { type: "integer" },
    defined: { type: "boolean" },
  },
  required: ["visibleFraction", "unseenCount", "defined"],
} as const;
/** Compare visible individuals with an explicitly supplied group-size denominator without estimating true group size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visibleIndividuals, recordedGroupSize } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(recordedGroupSize) &&
        recordedGroupSize >= 0 &&
        recordedGroupSize <= Number.MAX_SAFE_INTEGER,
      "recordedGroupSize",
    ),
      recordedGroupSize);
    (H.domain(
      Number.isSafeInteger(visibleIndividuals) &&
        visibleIndividuals >= 0 &&
        visibleIndividuals <= recordedGroupSize,
      "visibleIndividuals",
    ),
      visibleIndividuals);
    return {
      visibleFraction:
        recordedGroupSize > 0 ? visibleIndividuals / recordedGroupSize : 0,
      unseenCount: recordedGroupSize - visibleIndividuals,
      defined: recordedGroupSize > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visibleIndividuals: 8, recordedGroupSize: 10 },
  output: { visibleFraction: 0.8, unseenCount: 2, defined: true },
} satisfies ToolExample<Input, Output>;
export const animalGroupVisibilityFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["zoology", "biology"],
      keywords: ["zoology", "biology"],
    },
    id: "zoology/animal-group-visibility-fraction",
    title: "Animal Group Visibility Fraction",
    description:
      "Compare visible individuals with an explicitly supplied group-size denominator without estimating true group size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleIndividuals: { type: "integer", minimum: 0 },
        recordedGroupSize: { type: "integer", minimum: 0 },
      },
      required: ["visibleIndividuals", "recordedGroupSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleFraction: { type: "number" },
        unseenCount: { type: "integer" },
        defined: { type: "boolean" },
      },
      required: ["visibleFraction", "unseenCount", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "visibleIndividuals",
          label: "Visible Individuals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedGroupSize",
          label: "Recorded Group Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "visibleFraction",
          label: "Visible Fraction",
          valueType: { type: "number" },
        },
        {
          id: "unseenCount",
          label: "Unseen Count",
          valueType: { type: "integer" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = animalGroupVisibilityFractionTool.execute;
export default animalGroupVisibilityFractionTool;
