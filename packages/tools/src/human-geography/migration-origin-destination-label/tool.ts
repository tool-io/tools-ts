import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originWording: string;
  readonly destinationWording: string;
  readonly classificationVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originWording: { type: "string", maxLength: 8192, minLength: 1 },
    destinationWording: { type: "string", maxLength: 8192, minLength: 1 },
    classificationVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["originWording", "destinationWording", "classificationVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicitly recorded migration endpoints by their classification version without assigning nationalities or migration status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originWording, destinationWording, classificationVersion } = request;
  const compute = (): Output => {
    H.domain(originWording.length > 0, "originWording");
    H.domain(destinationWording.length > 0, "destinationWording");
    H.domain(classificationVersion.length > 0, "classificationVersion");
    return {
      token: JSON.stringify([
        originWording,
        destinationWording,
        classificationVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originWording: "Region A",
    destinationWording: "Region B",
    classificationVersion: "v2",
  },
  output: { token: '["Region A","Region B","v2"]' },
} satisfies ToolExample<Input, Output>;
export const migrationOriginDestinationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/migration-origin-destination-label",
    title: "Migration Origin Destination Label",
    description:
      "Qualify explicitly recorded migration endpoints by their classification version without assigning nationalities or migration status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originWording: { type: "string", maxLength: 8192, minLength: 1 },
        destinationWording: { type: "string", maxLength: 8192, minLength: 1 },
        classificationVersion: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: [
        "originWording",
        "destinationWording",
        "classificationVersion",
      ],
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
          id: "originWording",
          label: "Origin Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "destinationWording",
          label: "Destination Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "classificationVersion",
          label: "Classification Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = migrationOriginDestinationLabelTool.execute;
export default migrationOriginDestinationLabelTool;
