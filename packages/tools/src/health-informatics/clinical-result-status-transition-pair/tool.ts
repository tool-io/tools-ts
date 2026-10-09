import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousStatus: string;
  readonly nextStatus: string;
  readonly allowedFrom: readonly string[];
  readonly allowedTo: readonly string[];
};
export type Output = {
  readonly changed: boolean;
  readonly listedTransition: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousStatus: { type: "string", maxLength: 8192, minLength: 1 },
    nextStatus: { type: "string", maxLength: 8192, minLength: 1 },
    allowedFrom: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowedTo: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["previousStatus", "nextStatus", "allowedFrom", "allowedTo"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changed: { type: "boolean" },
    listedTransition: { type: "boolean" },
  },
  required: ["changed", "listedTransition"],
} as const;
/** Check a recorded result-status transition against an explicit caller-supplied transition list without inventing workflow rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousStatus, nextStatus, allowedFrom, allowedTo } = request;
  const compute = (): Output => {
    H.domain(allowedFrom.length === allowedTo.length, "allowedTo");
    H.domain(
      previousStatus.length > 0 && nextStatus.length > 0,
      "previousStatus",
    );
    return {
      changed: previousStatus !== nextStatus,
      listedTransition: allowedFrom.some(
        (x, i) => x === previousStatus && allowedTo[i] === nextStatus,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousStatus: "preliminary",
    nextStatus: "final",
    allowedFrom: ["preliminary"],
    allowedTo: ["final"],
  },
  output: { changed: true, listedTransition: true },
} satisfies ToolExample<Input, Output>;
export const clinicalResultStatusTransitionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "health-informatics",
        "health informatics",
        "research and quality management",
      ],
      keywords: ["health informatics", "research and quality management"],
    },
    id: "health-informatics/clinical-result-status-transition-pair",
    title: "Clinical Result Status Transition Pair",
    description:
      "Check a recorded result-status transition against an explicit caller-supplied transition list without inventing workflow rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousStatus: { type: "string", maxLength: 8192, minLength: 1 },
        nextStatus: { type: "string", maxLength: 8192, minLength: 1 },
        allowedFrom: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        allowedTo: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["previousStatus", "nextStatus", "allowedFrom", "allowedTo"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changed: { type: "boolean" },
        listedTransition: { type: "boolean" },
      },
      required: ["changed", "listedTransition"],
    },
    ports: {
      inputs: [
        {
          id: "previousStatus",
          label: "Previous Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextStatus",
          label: "Next Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedFrom",
          label: "Allowed From",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "allowedTo",
          label: "Allowed To",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        {
          id: "listedTransition",
          label: "Listed Transition",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = clinicalResultStatusTransitionPairTool.execute;
export default clinicalResultStatusTransitionPairTool;
