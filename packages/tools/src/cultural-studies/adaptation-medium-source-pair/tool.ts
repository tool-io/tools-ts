import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly sourceMedium: string;
  readonly adaptationMedium: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceMedium: { type: "string", maxLength: 8192, minLength: 1 },
    adaptationMedium: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["workId", "sourceMedium", "adaptationMedium"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly supplied source and adaptation media without inferring a relationship between works. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, sourceMedium, adaptationMedium } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0, "workId");
    H.domain(sourceMedium.length > 0, "sourceMedium");
    H.domain(adaptationMedium.length > 0, "adaptationMedium");
    return { token: JSON.stringify([workId, sourceMedium, adaptationMedium]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workId: "W17", sourceMedium: "novel", adaptationMedium: "film" },
  output: { token: '["W17","novel","film"]' },
} satisfies ToolExample<Input, Output>;
export const adaptationMediumSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cultural-studies", "cultural studies", "humanities"],
      keywords: ["cultural studies", "humanities"],
    },
    id: "cultural-studies/adaptation-medium-source-pair",
    title: "Adaptation Medium Source Pair",
    description:
      "Pair explicitly supplied source and adaptation media without inferring a relationship between works.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceMedium: { type: "string", maxLength: 8192, minLength: 1 },
        adaptationMedium: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["workId", "sourceMedium", "adaptationMedium"],
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
          id: "workId",
          label: "Work Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceMedium",
          label: "Source Medium",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "adaptationMedium",
          label: "Adaptation Medium",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = adaptationMediumSourcePairTool.execute;
export default adaptationMediumSourcePairTool;
