import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLabel: string;
  readonly secondLabel: string;
  readonly knownFirst: boolean;
  readonly knownSecond: boolean;
};
export type Output = {
  readonly comparable: boolean;
  readonly disagrees: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLabel: { type: "string", maxLength: 8192 },
    secondLabel: { type: "string", maxLength: 8192 },
    knownFirst: { type: "boolean" },
    knownSecond: { type: "boolean" },
  },
  required: ["firstLabel", "secondLabel", "knownFirst", "knownSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comparable: { type: "boolean" },
    disagrees: { type: "boolean" },
  },
  required: ["comparable", "disagrees"],
} as const;
/** Calculate adjudication disagreement flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLabel, secondLabel, knownFirst, knownSecond } = request;
  const compute = (): Output => {
    return {
      comparable: knownFirst && knownSecond,
      disagrees: knownFirst && knownSecond && firstLabel !== secondLabel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLabel: "A",
    secondLabel: "B",
    knownFirst: true,
    knownSecond: true,
  },
  output: { comparable: true, disagrees: true },
} satisfies ToolExample<Input, Output>;
export const adjudicationDisagreementFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/adjudication-disagreement-flag",
    title: "Adjudication Disagreement Flag Tool",
    description:
      "Calculate adjudication disagreement flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLabel: { type: "string", maxLength: 8192 },
        secondLabel: { type: "string", maxLength: 8192 },
        knownFirst: { type: "boolean" },
        knownSecond: { type: "boolean" },
      },
      required: ["firstLabel", "secondLabel", "knownFirst", "knownSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comparable: { type: "boolean" },
        disagrees: { type: "boolean" },
      },
      required: ["comparable", "disagrees"],
    },
    ports: {
      inputs: [
        {
          id: "firstLabel",
          label: "First Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondLabel",
          label: "Second Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "knownFirst",
          label: "Known First",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "knownSecond",
          label: "Known Second",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
        { id: "disagrees", label: "Disagrees", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = adjudicationDisagreementFlagTool.execute;
export default adjudicationDisagreementFlagTool;
