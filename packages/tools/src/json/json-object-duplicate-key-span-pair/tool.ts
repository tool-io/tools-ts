import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leftKey: string;
  readonly leftOffset: number;
  readonly rightKey: string;
  readonly rightOffset: number;
};
export type Output = {
  readonly duplicate: boolean;
  readonly offsets: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftKey: { type: "string", maxLength: 8192 },
    leftOffset: { type: "integer", minimum: 0 },
    rightKey: { type: "string", maxLength: 8192 },
    rightOffset: { type: "integer", minimum: 0 },
  },
  required: ["leftKey", "leftOffset", "rightKey", "rightOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicate: { type: "boolean" },
    offsets: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["duplicate", "offsets"],
} as const;
/** Compute json object duplicate key span pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leftKey, leftOffset, rightKey, rightOffset } = input;
  const compute = (): Output => {
    integer(leftOffset);
    integer(rightOffset);
    domain(leftOffset < rightOffset);
    return {
      duplicate: leftKey === rightKey,
      offsets: leftKey === rightKey ? [leftOffset, rightOffset] : [],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftKey: "a", leftOffset: 1, rightKey: "a", rightOffset: 8 },
  output: { duplicate: true, offsets: [1, 8] },
} satisfies ToolExample<Input, Output>;
export const jsonObjectDuplicateKeySpanPairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-object-duplicate-key-span-pair",
  title: "JSON Object Duplicate Key Span Pair Tool",
  description:
    "Compute json object duplicate key span pair from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leftKey",
        label: "Left Key",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "leftOffset",
        label: "Left Offset",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightKey",
        label: "Right Key",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "rightOffset",
        label: "Right Offset",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "duplicate", label: "Duplicate", valueType: { type: "boolean" } },
      {
        id: "offsets",
        label: "Offsets",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = jsonObjectDuplicateKeySpanPairTool.execute;
export default jsonObjectDuplicateKeySpanPairTool;
