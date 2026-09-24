import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly logits: readonly number[];
  readonly policy: string;
};
export type Output = { readonly indices: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logits: { type: "array", maxItems: 256, items: { type: "number" } },
    policy: { type: "string", maxLength: 8192, enum: ["all", "first", "last"] },
  },
  required: ["logits", "policy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indices: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["indices"],
} as const;
/** Compute classifier logit tie policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { logits, policy } = input;
  const compute = (): Output => {
    domain(logits.length > 0 && ["all", "first", "last"].includes(policy));
    const max = Math.max(...logits),
      indices = logits.flatMap((x, i) => (x === max ? [i] : []));
    return {
      indices:
        policy === "all"
          ? indices
          : policy === "first"
            ? [indices[0]]
            : [indices.at(-1)!],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { logits: [1, 3, 3], policy: "all" },
  output: { indices: [1, 2] },
} satisfies ToolExample<Input, Output>;
export const classifierLogitTiePolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/classifier-logit-tie-policy",
  title: "Classifier Logit Tie Policy Tool",
  description:
    "Compute classifier logit tie policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "logits",
        label: "Logits",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "policy",
        label: "Policy",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "indices",
        label: "Indices",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = classifierLogitTiePolicyTool.execute;
export default classifierLogitTiePolicyTool;
