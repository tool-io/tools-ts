import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citingAuthors: readonly string[];
  readonly citedAuthors: readonly string[];
  readonly exclude: boolean;
};
export type Output = {
  readonly sharedAuthors: readonly string[];
  readonly selfCitation: boolean;
  readonly counted: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citingAuthors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    citedAuthors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    exclude: { type: "boolean" },
  },
  required: ["citingAuthors", "citedAuthors", "exclude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharedAuthors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selfCitation: { type: "boolean" },
    counted: { type: "boolean" },
  },
  required: ["sharedAuthors", "selfCitation", "counted"],
} as const;
/** Author-identifier overlap using exact caller-supplied normalized identities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citingAuthors, citedAuthors, exclude } = request;
  const compute = (): Output => {
    const cited = new Set(citedAuthors),
      sharedAuthors = [...new Set(citingAuthors)].filter((a) => cited.has(a)),
      selfCitation = sharedAuthors.length > 0;
    return { sharedAuthors, selfCitation, counted: !exclude || !selfCitation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citingAuthors: ["A", "B"], citedAuthors: ["B", "C"], exclude: true },
  output: { sharedAuthors: ["B"], selfCitation: true, counted: false },
} satisfies ToolExample<Input, Output>;
export const selfCitationExclusionOneRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/self-citation-exclusion-one-record",
    title: "Self Citation Exclusion One Record Tool",
    description:
      "Author-identifier overlap using exact caller-supplied normalized identities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citingAuthors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        citedAuthors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exclude: { type: "boolean" },
      },
      required: ["citingAuthors", "citedAuthors", "exclude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sharedAuthors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selfCitation: { type: "boolean" },
        counted: { type: "boolean" },
      },
      required: ["sharedAuthors", "selfCitation", "counted"],
    },
    ports: {
      inputs: [
        {
          id: "citingAuthors",
          label: "Citing Authors",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "citedAuthors",
          label: "Cited Authors",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "exclude",
          label: "Exclude",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sharedAuthors",
          label: "Shared Authors",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selfCitation",
          label: "Self Citation",
          valueType: { type: "boolean" },
        },
        { id: "counted", label: "Counted", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = selfCitationExclusionOneRecordTool.execute;
export default selfCitationExclusionOneRecordTool;
