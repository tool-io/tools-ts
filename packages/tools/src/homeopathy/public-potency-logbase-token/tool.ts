import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly sourceTokens: readonly string[];
  readonly suppliedBases: readonly number[];
  readonly sourceNamespace: string;
};
export type Output = {
  readonly recognized: boolean;
  readonly logBase: number;
  readonly source: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    sourceTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedBases: { type: "array", maxItems: 256, items: { type: "number" } },
    sourceNamespace: { type: "string", maxLength: 8192 },
  },
  required: ["token", "sourceTokens", "suppliedBases", "sourceNamespace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    logBase: { type: "number" },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["recognized", "logBase", "source"],
} as const;
/** Look up a caller-verified source-specific formal logarithm base without activity, efficacy or treatment inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, sourceTokens, suppliedBases, sourceNamespace } = request;
  const compute = (): Output => {
    H.sameLength(sourceTokens, suppliedBases);
    H.domain(
      sourceNamespace.length > 0 &&
        new Set(sourceTokens).size === sourceTokens.length &&
        suppliedBases.every((x) => x > 1),
    );
    const i = sourceTokens.indexOf(token);
    return {
      recognized: i >= 0,
      logBase: i >= 0 ? suppliedBases[i] : 0,
      source: sourceNamespace,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "A",
    sourceTokens: ["A", "B"],
    suppliedBases: [10, 100],
    sourceNamespace: "verified-source",
  },
  output: { recognized: true, logBase: 10, source: "verified-source" },
} satisfies ToolExample<Input, Output>;
export const publicPotencyLogbaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/public-potency-logbase-token",
    title: "Public Potency Logbase Token Tool",
    description:
      "Look up a caller-verified source-specific formal logarithm base without activity, efficacy or treatment inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        sourceTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedBases: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sourceNamespace: { type: "string", maxLength: 8192 },
      },
      required: ["token", "sourceTokens", "suppliedBases", "sourceNamespace"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        logBase: { type: "number" },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["recognized", "logBase", "source"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceTokens",
          label: "Source Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedBases",
          label: "Supplied Bases",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceNamespace",
          label: "Source Namespace",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "logBase", label: "Log Base", valueType: { type: "number" } },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = publicPotencyLogbaseTokenTool.execute;
export default publicPotencyLogbaseTokenTool;
