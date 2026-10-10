import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agentCode: string;
  readonly sourceReference: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agentCode: { type: "string", maxLength: 8192, minLength: 1 },
    sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["agentCode", "sourceReference", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied occupational exposure-limit reference and edition without providing or applying a limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agentCode, sourceReference, edition } = request;
  const compute = (): Output => {
    H.domain(agentCode.length > 0, "agentCode");
    H.domain(sourceReference.length > 0, "sourceReference");
    H.domain(edition.length > 0, "edition");
    return { token: JSON.stringify([agentCode, sourceReference, edition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { agentCode: "A17", sourceReference: "Reference A", edition: "2026" },
  output: { token: '["A17","Reference A","2026"]' },
} satisfies ToolExample<Input, Output>;
export const workPlaceExposureLimitEditionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-health",
        "occupational health",
        "health and medicine",
      ],
      keywords: ["occupational health", "health and medicine"],
    },
    id: "occupational-health/work-place-exposure-limit-edition",
    title: "Work Place Exposure Limit Edition",
    description:
      "Record a supplied occupational exposure-limit reference and edition without providing or applying a limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agentCode: { type: "string", maxLength: 8192, minLength: 1 },
        sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["agentCode", "sourceReference", "edition"],
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
          id: "agentCode",
          label: "Agent Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceReference",
          label: "Source Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = workPlaceExposureLimitEditionTool.execute;
export default workPlaceExposureLimitEditionTool;
