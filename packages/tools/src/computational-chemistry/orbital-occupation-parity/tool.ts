import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly occupations: readonly number[] };
export type Output = {
  readonly electronCountDecimal: string;
  readonly odd: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupations: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["occupations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    electronCountDecimal: { type: "string", maxLength: 8192 },
    odd: { type: "boolean" },
  },
  required: ["electronCountDecimal", "odd"],
} as const;
/** Count supplied spatial-orbital occupations of zero, one or two electrons without inferring spin states. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupations } = request;
  const compute = (): Output => {
    H.domain(occupations.every((x) => x >= 0 && x <= 2));
    const n = occupations.reduce((s, x) => s + BigInt(x), 0n);
    return { electronCountDecimal: n.toString(), odd: n % 2n === 1n };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occupations: [2, 2, 1] },
  output: { electronCountDecimal: "5", odd: true },
} satisfies ToolExample<Input, Output>;
export const orbitalOccupationParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/orbital-occupation-parity",
    title: "Orbital Occupation Parity Tool",
    description:
      "Count supplied spatial-orbital occupations of zero, one or two electrons without inferring spin states.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupations: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["occupations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        electronCountDecimal: { type: "string", maxLength: 8192 },
        odd: { type: "boolean" },
      },
      required: ["electronCountDecimal", "odd"],
    },
    ports: {
      inputs: [
        {
          id: "occupations",
          label: "Occupations",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "electronCountDecimal",
          label: "Electron Count Decimal",
          valueType: { type: "string" },
        },
        { id: "odd", label: "Odd", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = orbitalOccupationParityTool.execute;
export default orbitalOccupationParityTool;
