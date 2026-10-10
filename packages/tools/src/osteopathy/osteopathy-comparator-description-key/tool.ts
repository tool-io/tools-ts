import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly comparatorId: string;
  readonly descriptionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    comparatorId: { type: "string", maxLength: 8192, minLength: 1 },
    descriptionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "comparatorId", "descriptionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit comparator description by study and source without assessing treatment efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, comparatorId, descriptionSource } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(comparatorId.length > 0, "comparatorId");
    H.domain(descriptionSource.length > 0, "descriptionSource");
    return {
      token: JSON.stringify([studyId, comparatorId, descriptionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    studyId: "ST17",
    comparatorId: "C2",
    descriptionSource: "Protocol v2",
  },
  output: { token: '["ST17","C2","Protocol v2"]' },
} satisfies ToolExample<Input, Output>;
export const osteopathyComparatorDescriptionKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["osteopathy", "health and medicine"],
      keywords: ["osteopathy", "health and medicine"],
    },
    id: "osteopathy/osteopathy-comparator-description-key",
    title: "Osteopathy Comparator Description Key",
    description:
      "Qualify an explicit comparator description by study and source without assessing treatment efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        comparatorId: { type: "string", maxLength: 8192, minLength: 1 },
        descriptionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "comparatorId", "descriptionSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "comparatorId",
          label: "Comparator Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "descriptionSource",
          label: "Description Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = osteopathyComparatorDescriptionKeyTool.execute;
export default osteopathyComparatorDescriptionKeyTool;
