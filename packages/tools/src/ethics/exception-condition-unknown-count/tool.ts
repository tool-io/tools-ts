import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly conditionStates: readonly string[] };
export type Output = {
  readonly unknown: number;
  readonly trueCount: number;
  readonly falseCount: number;
  readonly exceptionEstablished: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionStates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["conditionStates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unknown: { type: "integer" },
    trueCount: { type: "integer" },
    falseCount: { type: "integer" },
    exceptionEstablished: { type: "boolean" },
  },
  required: ["unknown", "trueCount", "falseCount", "exceptionEstablished"],
} as const;
/** Count caller-assessed condition states under an explicit nonempty all-true convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conditionStates } = request;
  const compute = (): Output => {
    H.domain(
      conditionStates.every((x) => ["true", "false", "unknown"].includes(x)),
    );
    return {
      unknown: conditionStates.filter((x) => x === "unknown").length,
      trueCount: conditionStates.filter((x) => x === "true").length,
      falseCount: conditionStates.filter((x) => x === "false").length,
      exceptionEstablished:
        conditionStates.length > 0 &&
        conditionStates.every((x) => x === "true"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conditionStates: ["true", "unknown", "false"] },
  output: {
    unknown: 1,
    trueCount: 1,
    falseCount: 1,
    exceptionEstablished: false,
  },
} satisfies ToolExample<Input, Output>;
export const exceptionConditionUnknownCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/exception-condition-unknown-count",
    title: "Exception Condition Unknown Count Tool",
    description:
      "Count caller-assessed condition states under an explicit nonempty all-true convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionStates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["conditionStates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unknown: { type: "integer" },
        trueCount: { type: "integer" },
        falseCount: { type: "integer" },
        exceptionEstablished: { type: "boolean" },
      },
      required: ["unknown", "trueCount", "falseCount", "exceptionEstablished"],
    },
    ports: {
      inputs: [
        {
          id: "conditionStates",
          label: "Condition States",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "unknown", label: "Unknown", valueType: { type: "integer" } },
        {
          id: "trueCount",
          label: "True Count",
          valueType: { type: "integer" },
        },
        {
          id: "falseCount",
          label: "False Count",
          valueType: { type: "integer" },
        },
        {
          id: "exceptionEstablished",
          label: "Exception Established",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = exceptionConditionUnknownCountTool.execute;
export default exceptionConditionUnknownCountTool;
