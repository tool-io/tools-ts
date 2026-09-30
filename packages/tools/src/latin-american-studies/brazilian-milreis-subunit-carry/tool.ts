import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly major: number;
  readonly subunits: number;
  readonly suppliedBase: number;
};
export type Output = {
  readonly normalizedMajor: number;
  readonly normalizedSubunits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    major: { type: "integer" },
    subunits: { type: "integer" },
    suppliedBase: { type: "integer", minimum: 1 },
  },
  required: ["major", "subunits", "suppliedBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedMajor: { type: "integer" },
    normalizedSubunits: { type: "integer" },
  },
  required: ["normalizedMajor", "normalizedSubunits"],
} as const;
/** Normalize historical ledger subunits using an explicit caller-supplied base; no exchange value is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { major, subunits, suppliedBase } = request;
  const compute = (): Output => {
    H.integer(major, -Number.MAX_SAFE_INTEGER);
    H.integer(subunits, -Number.MAX_SAFE_INTEGER);
    H.integer(suppliedBase, 1);
    const total = BigInt(major) * BigInt(suppliedBase) + BigInt(subunits),
      base = BigInt(suppliedBase),
      r = ((total % base) + base) % base;
    return {
      normalizedMajor: Number((total - r) / base),
      normalizedSubunits: Number(r),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { major: 2, subunits: 1500, suppliedBase: 1000 },
  output: { normalizedMajor: 3, normalizedSubunits: 500 },
} satisfies ToolExample<Input, Output>;
export const brazilianMilreisSubunitCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/brazilian-milreis-subunit-carry",
    title: "Brazilian Milreis Subunit Carry Tool",
    description:
      "Normalize historical ledger subunits using an explicit caller-supplied base; no exchange value is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        major: { type: "integer" },
        subunits: { type: "integer" },
        suppliedBase: { type: "integer", minimum: 1 },
      },
      required: ["major", "subunits", "suppliedBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedMajor: { type: "integer" },
        normalizedSubunits: { type: "integer" },
      },
      required: ["normalizedMajor", "normalizedSubunits"],
    },
    ports: {
      inputs: [
        {
          id: "major",
          label: "Major",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subunits",
          label: "Subunits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedBase",
          label: "Supplied Base",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "normalizedMajor",
          label: "Normalized Major",
          valueType: { type: "integer" },
        },
        {
          id: "normalizedSubunits",
          label: "Normalized Subunits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = brazilianMilreisSubunitCarryTool.execute;
export default brazilianMilreisSubunitCarryTool;
