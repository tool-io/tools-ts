import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly system: string;
  readonly code: string;
  readonly version: string;
  readonly display: string;
};
export type Output = {
  readonly identityKey: string;
  readonly hasVersion: boolean;
  readonly hasDisplay: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    system: { type: "string", maxLength: 8192 },
    code: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
    display: { type: "string", maxLength: 8192 },
  },
  required: ["system", "code", "version", "display"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identityKey: { type: "string", maxLength: 8192 },
    hasVersion: { type: "boolean" },
    hasDisplay: { type: "boolean" },
  },
  required: ["identityKey", "hasVersion", "hasDisplay"],
} as const;
/** Build a version-aware identity tuple for a supplied FHIR Coding; display text is not used as code identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { system, code, version, display } = request;
  const compute = (): Output => {
    H.domain(system.length > 0 && code.length > 0);
    return {
      identityKey: JSON.stringify([system, version, code]),
      hasVersion: version.length > 0,
      hasDisplay: display.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    system: "urn:example:codes",
    code: "001",
    version: "v2",
    display: "Example",
  },
  output: {
    identityKey: '["urn:example:codes","v2","001"]',
    hasVersion: true,
    hasDisplay: true,
  },
} satisfies ToolExample<Input, Output>;
export const fhirCodingVersionDisplayPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-coding-version-display-pair",
    title: "FHIR Coding Version Display Pair Tool",
    description:
      "Build a version-aware identity tuple for a supplied FHIR Coding; display text is not used as code identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        system: { type: "string", maxLength: 8192 },
        code: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
        display: { type: "string", maxLength: 8192 },
      },
      required: ["system", "code", "version", "display"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identityKey: { type: "string", maxLength: 8192 },
        hasVersion: { type: "boolean" },
        hasDisplay: { type: "boolean" },
      },
      required: ["identityKey", "hasVersion", "hasDisplay"],
    },
    ports: {
      inputs: [
        {
          id: "system",
          label: "System",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "display",
          label: "Display",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "identityKey",
          label: "Identity Key",
          valueType: { type: "string" },
        },
        {
          id: "hasVersion",
          label: "Has Version",
          valueType: { type: "boolean" },
        },
        {
          id: "hasDisplay",
          label: "Has Display",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = fhirCodingVersionDisplayPairTool.execute;
export default fhirCodingVersionDisplayPairTool;
