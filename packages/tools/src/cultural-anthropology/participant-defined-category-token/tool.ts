import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly authorizedCategories: readonly string[];
};
export type Output = { readonly recognized: boolean; readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    authorizedCategories: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["token", "authorizedCategories"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recognized: { type: "boolean" }, index: { type: "integer" } },
  required: ["recognized", "index"],
} as const;
/** Match explicit participant-authorized labels without inferring identities or restricted cultural categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, authorizedCategories } = request;
  const compute = (): Output => {
    H.domain(
      new Set(authorizedCategories).size === authorizedCategories.length,
    );
    return {
      recognized: authorizedCategories.includes(token),
      index: authorizedCategories.indexOf(token),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "A", authorizedCategories: ["A", "B"] },
  output: { recognized: true, index: 0 },
} satisfies ToolExample<Input, Output>;
export const participantDefinedCategoryTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/participant-defined-category-token",
    title: "Participant Defined Category Token Tool",
    description:
      "Match explicit participant-authorized labels without inferring identities or restricted cultural categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        authorizedCategories: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["token", "authorizedCategories"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        index: { type: "integer" },
      },
      required: ["recognized", "index"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorizedCategories",
          label: "Authorized Categories",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = participantDefinedCategoryTokenTool.execute;
export default participantDefinedCategoryTokenTool;
