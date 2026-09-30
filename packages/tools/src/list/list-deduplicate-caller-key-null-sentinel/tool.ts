import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly keys: readonly string[];
  readonly nullMask: readonly boolean[];
};
export type Output = { readonly keep: readonly boolean[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    nullMask: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["keys", "nullMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keep: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["keep"],
} as const;
/** Calculate list deduplicate caller key null sentinel from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { keys, nullMask } = input;
  const compute = (): Output => {
    H.sameLength(keys, nullMask);
    const seen = new Set<string>();
    let seenNull = false;
    return {
      keep: keys.map((key, i) => {
        if (nullMask[i]) {
          const keep = !seenNull;
          seenNull = true;
          return keep;
        }
        const keep = !seen.has(key);
        seen.add(key);
        return keep;
      }),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { keys: ["null", "null", "null"], nullMask: [false, true, false] },
  output: { keep: [true, true, false] },
} satisfies ToolExample<Input, Output>;
export const listDeduplicateCallerKeyNullSentinelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "list/list-deduplicate-caller-key-null-sentinel",
      title: "List Deduplicate Caller Key Null Sentinel Tool",
      description:
        "Calculate list deduplicate caller key null sentinel from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          keys: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          nullMask: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["keys", "nullMask"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          keep: { type: "array", maxItems: 256, items: { type: "boolean" } },
        },
        required: ["keep"],
      },
      ports: {
        inputs: [
          {
            id: "keys",
            label: "Keys",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "nullMask",
            label: "Null Mask",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "keep",
            label: "Keep",
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = listDeduplicateCallerKeyNullSentinelTool.execute;
export default listDeduplicateCallerKeyNullSentinelTool;
