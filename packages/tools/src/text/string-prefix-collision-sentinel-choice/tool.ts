import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly string[];
  readonly prefix: string;
};
export type Output = { readonly sentinel: string; readonly added: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    prefix: { type: "string", maxLength: 8192 },
  },
  required: ["values", "prefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sentinel: { type: "string", maxLength: 8192 },
    added: { type: "integer" },
  },
  required: ["sentinel", "added"],
} as const;
/** Calculate string prefix collision sentinel choice from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, prefix } = request;
  const compute = (): Output => {
    H.domain(prefix.length > 0);
    let sentinel = prefix,
      added = 0;
    while (values.some((x) => x.startsWith(sentinel))) {
      sentinel += "_";
      added++;
    }
    return { sentinel, added };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: ["_x", "__y"], prefix: "_" },
  output: { sentinel: "___", added: 2 },
} satisfies ToolExample<Input, Output>;
export const stringPrefixCollisionSentinelChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "text/string-prefix-collision-sentinel-choice",
      title: "String Prefix Collision Sentinel Choice Tool",
      description:
        "Calculate string prefix collision sentinel choice from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          values: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          prefix: { type: "string", maxLength: 8192 },
        },
        required: ["values", "prefix"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sentinel: { type: "string", maxLength: 8192 },
          added: { type: "integer" },
        },
        required: ["sentinel", "added"],
      },
      ports: {
        inputs: [
          {
            id: "values",
            label: "Values",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "prefix",
            label: "Prefix",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "sentinel", label: "Sentinel", valueType: { type: "string" } },
          { id: "added", label: "Added", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = stringPrefixCollisionSentinelChoiceTool.execute;
export default stringPrefixCollisionSentinelChoiceTool;
