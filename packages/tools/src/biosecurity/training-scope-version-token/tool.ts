import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scope: string;
  readonly version: string;
  readonly source: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scope: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["scope", "version", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Preserve explicit protective-training scope/version identity without a competence judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scope, version, source } = request;
  const compute = (): Output => {
    H.domain(scope.length > 0 && version.length > 0 && source.length > 0);
    return { key: JSON.stringify([source, scope, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scope: "review", version: "v2", source: "sourceA" },
  output: { key: '["sourceA","review","v2"]' },
} satisfies ToolExample<Input, Output>;
export const trainingScopeVersionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/training-scope-version-token",
    title: "Training Scope Version Token Tool",
    description:
      "Preserve explicit protective-training scope/version identity without a competence judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scope: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["scope", "version", "source"],
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
          id: "scope",
          label: "Scope",
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
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = trainingScopeVersionTokenTool.execute;
export default trainingScopeVersionTokenTool;
