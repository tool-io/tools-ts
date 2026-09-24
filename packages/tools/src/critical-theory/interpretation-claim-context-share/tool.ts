import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimIds: readonly string[];
  readonly contextIds: readonly string[];
  readonly supported: readonly boolean[];
  readonly selectedClaim: string;
};
export type Output = {
  readonly contexts: number;
  readonly supportedContexts: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    contextIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedClaim: { type: "string", maxLength: 8192 },
  },
  required: ["claimIds", "contextIds", "supported", "selectedClaim"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contexts: { type: "integer" },
    supportedContexts: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["contexts", "supportedContexts", "share", "defined"],
} as const;
/** Calculate interpretation claim context share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimIds, contextIds, supported, selectedClaim } = request;
  const compute = (): Output => {
    H.sameLength(claimIds, contextIds);
    H.sameLength(claimIds, supported);
    return (() => {
      const all = new Set(
          contextIds.filter((x, i) => claimIds[i] === selectedClaim),
        ),
        yes = new Set(
          contextIds.filter(
            (x, i) => claimIds[i] === selectedClaim && supported[i],
          ),
        );
      return {
        contexts: all.size,
        supportedContexts: yes.size,
        share: all.size > 0 ? yes.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimIds: ["a", "a", "b"],
    contextIds: ["x", "y", "x"],
    supported: [true, false, true],
    selectedClaim: "a",
  },
  output: { contexts: 2, supportedContexts: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const interpretationClaimContextShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/interpretation-claim-context-share",
    title: "Interpretation Claim Context Share Tool",
    description:
      "Calculate interpretation claim context share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        contextIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedClaim: { type: "string", maxLength: 8192 },
      },
      required: ["claimIds", "contextIds", "supported", "selectedClaim"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contexts: { type: "integer" },
        supportedContexts: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["contexts", "supportedContexts", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "claimIds",
          label: "Claim Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "contextIds",
          label: "Context Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supported",
          label: "Supported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedClaim",
          label: "Selected Claim",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "contexts", label: "Contexts", valueType: { type: "integer" } },
        {
          id: "supportedContexts",
          label: "Supported Contexts",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = interpretationClaimContextShareTool.execute;
export default interpretationClaimContextShareTool;
