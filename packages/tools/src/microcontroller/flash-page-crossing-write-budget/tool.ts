import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly address: number;
  readonly bytes: number;
  readonly pageSize: number;
};
export type Output = {
  readonly firstPageBytes: number;
  readonly pages: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    address: { type: "integer", minimum: 0 },
    bytes: { type: "integer", minimum: 0 },
    pageSize: { type: "integer", minimum: 1 },
  },
  required: ["address", "bytes", "pageSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPageBytes: { type: "integer" },
    pages: { type: "integer" },
  },
  required: ["firstPageBytes", "pages"],
} as const;
/** Calculate flash page crossing write budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { address, bytes, pageSize } = input;
  const compute = (): Output => {
    H.integer(address, 0);
    H.integer(bytes, 0);
    H.integer(pageSize, 1);
    const room = pageSize - (address % pageSize);
    return {
      firstPageBytes: Math.min(bytes, room),
      pages:
        bytes === 0 ? 0 : 1 + Math.ceil(Math.max(0, bytes - room) / pageSize),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { address: 250, bytes: 20, pageSize: 256 },
  output: { firstPageBytes: 6, pages: 2 },
} satisfies ToolExample<Input, Output>;
export const flashPageCrossingWriteBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/flash-page-crossing-write-budget",
    title: "Flash Page Crossing Write Budget Tool",
    description:
      "Calculate flash page crossing write budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        address: { type: "integer", minimum: 0 },
        bytes: { type: "integer", minimum: 0 },
        pageSize: { type: "integer", minimum: 1 },
      },
      required: ["address", "bytes", "pageSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPageBytes: { type: "integer" },
        pages: { type: "integer" },
      },
      required: ["firstPageBytes", "pages"],
    },
    ports: {
      inputs: [
        {
          id: "address",
          label: "Address",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bytes",
          label: "Bytes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pageSize",
          label: "Page Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "firstPageBytes",
          label: "First Page Bytes",
          valueType: { type: "integer" },
        },
        { id: "pages", label: "Pages", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = flashPageCrossingWriteBudgetTool.execute;
export default flashPageCrossingWriteBudgetTool;
