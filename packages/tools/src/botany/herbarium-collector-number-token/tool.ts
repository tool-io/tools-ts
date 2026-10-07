import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectorWording: string;
  readonly collectionNumber: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectorWording: { type: "string", maxLength: 8192, minLength: 1 },
    collectionNumber: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["collectorWording", "collectionNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve literal herbarium collector and collection-number wording, including leading zeros and nonnumeric collection labels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectorWording, collectionNumber } = request;
  const compute = (): Output => {
    H.domain(
      collectorWording.length > 0 && collectionNumber.length > 0,
      "collectorWording",
    );
    return { token: JSON.stringify([collectorWording, collectionNumber]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectorWording: "Collector A", collectionNumber: "017" },
  output: { token: '["Collector A","017"]' },
} satisfies ToolExample<Input, Output>;
export const herbariumCollectorNumberTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/herbarium-collector-number-token",
    title: "Herbarium Collector Number Token",
    description:
      "Preserve literal herbarium collector and collection-number wording, including leading zeros and nonnumeric collection labels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectorWording: { type: "string", maxLength: 8192, minLength: 1 },
        collectionNumber: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["collectorWording", "collectionNumber"],
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
          id: "collectorWording",
          label: "Collector Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collectionNumber",
          label: "Collection Number",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = herbariumCollectorNumberTokenTool.execute;
export default herbariumCollectorNumberTokenTool;
