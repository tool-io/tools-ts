import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifier: string;
  readonly namespaceSeparator: string;
  readonly versionSeparator: string;
};
export type Output = {
  readonly namespace: string;
  readonly localToken: string;
  readonly version: string;
  readonly hasVersion: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    namespaceSeparator: { type: "string", maxLength: 8192 },
    versionSeparator: { type: "string", maxLength: 8192 },
  },
  required: ["identifier", "namespaceSeparator", "versionSeparator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    namespace: { type: "string", maxLength: 8192 },
    localToken: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
    hasVersion: { type: "boolean" },
  },
  required: ["namespace", "localToken", "version", "hasVersion"],
} as const;
/** Split a caller-defined namespace/local/version grammar without canonicalizing identifier schemes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier, namespaceSeparator, versionSeparator } = request;
  const compute = (): Output => {
    H.domain(
      namespaceSeparator.length > 0 &&
        versionSeparator.length > 0 &&
        namespaceSeparator !== versionSeparator,
    );
    const i = identifier.indexOf(namespaceSeparator);
    H.domain(i > 0);
    const tail = identifier.slice(i + namespaceSeparator.length),
      j = tail.lastIndexOf(versionSeparator);
    H.domain(
      tail.length > 0 &&
        (j < 0 || (j > 0 && j + versionSeparator.length < tail.length)),
    );
    return {
      namespace: identifier.slice(0, i),
      localToken: j < 0 ? tail : tail.slice(0, j),
      version: j < 0 ? "" : tail.slice(j + versionSeparator.length),
      hasVersion: j >= 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    identifier: "ns:item@v2",
    namespaceSeparator: ":",
    versionSeparator: "@",
  },
  output: {
    namespace: "ns",
    localToken: "item",
    version: "v2",
    hasVersion: true,
  },
} satisfies ToolExample<Input, Output>;
export const identifierNamespaceVersionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/identifier-namespace-version-token",
    title: "Identifier Namespace Version Token Tool",
    description:
      "Split a caller-defined namespace/local/version grammar without canonicalizing identifier schemes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifier: { type: "string", maxLength: 8192 },
        namespaceSeparator: { type: "string", maxLength: 8192 },
        versionSeparator: { type: "string", maxLength: 8192 },
      },
      required: ["identifier", "namespaceSeparator", "versionSeparator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        namespace: { type: "string", maxLength: 8192 },
        localToken: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
        hasVersion: { type: "boolean" },
      },
      required: ["namespace", "localToken", "version", "hasVersion"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "namespaceSeparator",
          label: "Namespace Separator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "versionSeparator",
          label: "Version Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "namespace", label: "Namespace", valueType: { type: "string" } },
        {
          id: "localToken",
          label: "Local Token",
          valueType: { type: "string" },
        },
        { id: "version", label: "Version", valueType: { type: "string" } },
        {
          id: "hasVersion",
          label: "Has Version",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = identifierNamespaceVersionTokenTool.execute;
export default identifierNamespaceVersionTokenTool;
