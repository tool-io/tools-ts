import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { isPortableJsonValue } from "../../core/json-value.js";
export type Input = {
  readonly objectJson: string;
  readonly memberName: string;
  readonly defaultScalarJson: string;
  readonly nullUsesDefault: boolean;
};
export type Output = {
  readonly selectedJson: string;
  readonly usedDefault: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectJson: { type: "string", maxLength: 8192 },
    memberName: { type: "string", maxLength: 8192 },
    defaultScalarJson: { type: "string", maxLength: 8192 },
    nullUsesDefault: { type: "boolean" },
  },
  required: [
    "objectJson",
    "memberName",
    "defaultScalarJson",
    "nullUsesDefault",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedJson: { type: "string", maxLength: 8192 },
    usedDefault: { type: "boolean" },
  },
  required: ["selectedJson", "usedDefault"],
} as const;
/** Choose one explicit object member or a supplied scalar default, distinguishing absent members from null under an explicit policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectJson, memberName, defaultScalarJson, nullUsesDefault } =
    request;
  const compute = (): Output => {
    let object: unknown, fallback: unknown;
    try {
      object = JSON.parse(objectJson);
    } catch {
      H.domain(false, "objectJson");
    }
    try {
      fallback = JSON.parse(defaultScalarJson);
    } catch {
      H.domain(false, "defaultScalarJson");
    }
    H.domain(
      object !== null && typeof object === "object" && !Array.isArray(object),
      "objectJson",
    );
    H.domain(
      fallback === null ||
        typeof fallback === "string" ||
        typeof fallback === "boolean" ||
        (typeof fallback === "number" && Number.isFinite(fallback)),
      "defaultScalarJson",
    );
    H.domain(isPortableJsonValue(object), "objectJson");
    const entry = Object.entries(object).find(([name]) => name === memberName);
    const usedDefault = !entry || (nullUsesDefault && entry[1] === null);
    return {
      selectedJson: JSON.stringify(usedDefault ? fallback : entry[1]),
      usedDefault,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectJson: '{"a":null}',
    memberName: "a",
    defaultScalarJson: "3",
    nullUsesDefault: false,
  },
  output: { selectedJson: "null", usedDefault: false },
} satisfies ToolExample<Input, Output>;
export const jsonSingleMemberDefaultPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["json", "computer science"],
      keywords: ["JSON", "computer science"],
    },
    id: "json/json-single-member-default-policy",
    title: "JSON Single Member Default Policy",
    description:
      "Choose one explicit object member or a supplied scalar default, distinguishing absent members from null under an explicit policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectJson: { type: "string", maxLength: 8192 },
        memberName: { type: "string", maxLength: 8192 },
        defaultScalarJson: { type: "string", maxLength: 8192 },
        nullUsesDefault: { type: "boolean" },
      },
      required: [
        "objectJson",
        "memberName",
        "defaultScalarJson",
        "nullUsesDefault",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedJson: { type: "string", maxLength: 8192 },
        usedDefault: { type: "boolean" },
      },
      required: ["selectedJson", "usedDefault"],
    },
    ports: {
      inputs: [
        {
          id: "objectJson",
          label: "Object Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "memberName",
          label: "Member Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "defaultScalarJson",
          label: "Default Scalar Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nullUsesDefault",
          label: "Null Uses Default",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "selectedJson",
          label: "Selected Json",
          valueType: { type: "string" },
        },
        {
          id: "usedDefault",
          label: "Used Default",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonSingleMemberDefaultPolicyTool.execute;
export default jsonSingleMemberDefaultPolicyTool;
