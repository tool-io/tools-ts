import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousMode: string;
  readonly nextMode: string;
  readonly suppliedModes: readonly string[];
};
export type Output = {
  readonly changed: boolean;
  readonly transitionKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousMode: { type: "string", maxLength: 8192 },
    nextMode: { type: "string", maxLength: 8192 },
    suppliedModes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["previousMode", "nextMode", "suppliedModes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changed: { type: "boolean" },
    transitionKey: { type: "string", maxLength: 8192 },
  },
  required: ["changed", "transitionKey"],
} as const;
/** Calculate proxy wave transition token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousMode, nextMode, suppliedModes } = request;
  const compute = (): Output => {
    H.domain(
      suppliedModes.includes(previousMode) && suppliedModes.includes(nextMode),
    );
    return {
      changed: previousMode !== nextMode,
      transitionKey: JSON.stringify([previousMode, nextMode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousMode: "self",
    nextMode: "proxy",
    suppliedModes: ["self", "proxy"],
  },
  output: { changed: true, transitionKey: '["self","proxy"]' },
} satisfies ToolExample<Input, Output>;
export const proxyWaveTransitionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/proxy-wave-transition-token",
    title: "Proxy Wave Transition Token Tool",
    description:
      "Calculate proxy wave transition token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousMode: { type: "string", maxLength: 8192 },
        nextMode: { type: "string", maxLength: 8192 },
        suppliedModes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["previousMode", "nextMode", "suppliedModes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changed: { type: "boolean" },
        transitionKey: { type: "string", maxLength: 8192 },
      },
      required: ["changed", "transitionKey"],
    },
    ports: {
      inputs: [
        {
          id: "previousMode",
          label: "Previous Mode",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextMode",
          label: "Next Mode",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedModes",
          label: "Supplied Modes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        {
          id: "transitionKey",
          label: "Transition Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = proxyWaveTransitionTokenTool.execute;
export default proxyWaveTransitionTokenTool;
