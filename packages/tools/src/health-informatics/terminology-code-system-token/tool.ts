import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly system: string;
  readonly code: string;
  readonly version: string;
  readonly versionKnown: boolean;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    system: { type: "string", maxLength: 8192 },
    code: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
    versionKnown: { type: "boolean" },
  },
  required: ["system", "code", "version", "versionKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Build an unambiguous exact terminology identity key without resolving or interpreting a code system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { system, code, version, versionKnown } = request;
  const compute = (): Output => {
    H.domain(
      system.length > 0 &&
        code.length > 0 &&
        (!versionKnown || version.length > 0),
    );
    return {
      key: JSON.stringify([system, code, versionKnown ? version : null]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { system: "sys", code: "A1", version: "v2", versionKnown: true },
  output: { key: '["sys","A1","v2"]' },
} satisfies ToolExample<Input, Output>;
export const terminologyCodeSystemTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/terminology-code-system-token",
    title: "Terminology Code System Token Tool",
    description:
      "Build an unambiguous exact terminology identity key without resolving or interpreting a code system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        system: { type: "string", maxLength: 8192 },
        code: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
        versionKnown: { type: "boolean" },
      },
      required: ["system", "code", "version", "versionKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
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
          id: "versionKnown",
          label: "Version Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = terminologyCodeSystemTokenTool.execute;
export default terminologyCodeSystemTokenTool;
