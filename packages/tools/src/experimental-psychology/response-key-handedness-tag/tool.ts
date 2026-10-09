import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly keyName: string;
  readonly responseHand: string;
  readonly mappingVersion: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keyName: { type: "string", maxLength: 8192, minLength: 1 },
    responseHand: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "both", "unspecified"],
    },
    mappingVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["keyName", "responseHand", "mappingVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label a supplied response-key and hand mapping without inferring participant handedness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { keyName, responseHand, mappingVersion } = request;
  const compute = (): Output => {
    H.domain(keyName.length > 0 && mappingVersion.length > 0, "keyName");
    H.domain(
      ["left", "right", "both", "unspecified"].includes(responseHand),
      "responseHand",
    );
    return { tag: JSON.stringify([mappingVersion, keyName, responseHand]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { keyName: "F", responseHand: "left", mappingVersion: "v2" },
  output: { tag: '["v2","F","left"]' },
} satisfies ToolExample<Input, Output>;
export const responseKeyHandednessTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/response-key-handedness-tag",
    title: "Response Key Handedness Tag",
    description:
      "Label a supplied response-key and hand mapping without inferring participant handedness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        keyName: { type: "string", maxLength: 8192, minLength: 1 },
        responseHand: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "both", "unspecified"],
        },
        mappingVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["keyName", "responseHand", "mappingVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "keyName",
          label: "Key Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "responseHand",
          label: "Response Hand",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mappingVersion",
          label: "Mapping Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = responseKeyHandednessTagTool.execute;
export default responseKeyHandednessTagTool;
