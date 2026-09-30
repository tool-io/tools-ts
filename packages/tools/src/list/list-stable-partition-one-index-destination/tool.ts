import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mask: readonly boolean[];
  readonly selected: number;
  readonly trueFirst: boolean;
};
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mask: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selected: { type: "integer", minimum: 0 },
    trueFirst: { type: "boolean" },
  },
  required: ["mask", "selected", "trueFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" } },
  required: ["index"],
} as const;
/** Calculate list stable partition one index destination from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mask, selected, trueFirst } = input;
  const compute = (): Output => {
    H.integer(selected, 0, mask.length - 1);
    const own = mask[selected],
      before = mask.slice(0, selected).filter((x) => x === own).length,
      other = mask.filter((x) => x !== own).length;
    return { index: before + (own === trueFirst ? 0 : other) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mask: [false, true, false, true], selected: 2, trueFirst: true },
  output: { index: 3 },
} satisfies ToolExample<Input, Output>;
export const listStablePartitionOneIndexDestinationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "list/list-stable-partition-one-index-destination",
      title: "List Stable Partition One Index Destination Tool",
      description:
        "Calculate list stable partition one index destination from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mask: { type: "array", maxItems: 256, items: { type: "boolean" } },
          selected: { type: "integer", minimum: 0 },
          trueFirst: { type: "boolean" },
        },
        required: ["mask", "selected", "trueFirst"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { index: { type: "integer" } },
        required: ["index"],
      },
      ports: {
        inputs: [
          {
            id: "mask",
            label: "Mask",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "selected",
            label: "Selected",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "trueFirst",
            label: "True First",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "index", label: "Index", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = listStablePartitionOneIndexDestinationTool.execute;
export default listStablePartitionOneIndexDestinationTool;
