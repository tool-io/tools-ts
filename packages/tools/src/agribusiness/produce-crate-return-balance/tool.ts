import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cratesIssued: number;
  readonly cratesReturned: number;
  readonly cratesWrittenOff: number;
};
export type Output = { readonly outstandingCrates: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cratesIssued: { type: "integer", minimum: 0 },
    cratesReturned: { type: "integer", minimum: 0 },
    cratesWrittenOff: { type: "integer", minimum: 0 },
  },
  required: ["cratesIssued", "cratesReturned", "cratesWrittenOff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outstandingCrates: { type: "integer" } },
  required: ["outstandingCrates"],
} as const;
/** Balance issued produce crates against recorded returns and write-offs without assigning ownership or charging deposits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cratesIssued, cratesReturned, cratesWrittenOff } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(cratesIssued) &&
        cratesIssued >= 0 &&
        cratesIssued <= Number.MAX_SAFE_INTEGER,
      "cratesIssued",
    ),
      cratesIssued);
    (H.domain(
      Number.isSafeInteger(cratesReturned) &&
        cratesReturned >= 0 &&
        cratesReturned <= cratesIssued,
      "cratesReturned",
    ),
      cratesReturned);
    (H.domain(
      Number.isSafeInteger(cratesWrittenOff) &&
        cratesWrittenOff >= 0 &&
        cratesWrittenOff <= cratesIssued - cratesReturned,
      "cratesWrittenOff",
    ),
      cratesWrittenOff);
    return {
      outstandingCrates: cratesIssued - cratesReturned - cratesWrittenOff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cratesIssued: 80, cratesReturned: 60, cratesWrittenOff: 5 },
  output: { outstandingCrates: 15 },
} satisfies ToolExample<Input, Output>;
export const produceCrateReturnBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/produce-crate-return-balance",
    title: "Produce Crate Return Balance",
    description:
      "Balance issued produce crates against recorded returns and write-offs without assigning ownership or charging deposits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cratesIssued: { type: "integer", minimum: 0 },
        cratesReturned: { type: "integer", minimum: 0 },
        cratesWrittenOff: { type: "integer", minimum: 0 },
      },
      required: ["cratesIssued", "cratesReturned", "cratesWrittenOff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outstandingCrates: { type: "integer" } },
      required: ["outstandingCrates"],
    },
    ports: {
      inputs: [
        {
          id: "cratesIssued",
          label: "Crates Issued",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cratesReturned",
          label: "Crates Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cratesWrittenOff",
          label: "Crates Written Off",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outstandingCrates",
          label: "Outstanding Crates",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = produceCrateReturnBalanceTool.execute;
export default produceCrateReturnBalanceTool;
