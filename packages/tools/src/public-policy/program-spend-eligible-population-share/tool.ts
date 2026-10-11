import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly programSpend: number;
  readonly suppliedEligiblePeople: number;
};
export type Output = { readonly spendPerEligiblePerson: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    programSpend: { type: "number", minimum: 0 },
    suppliedEligiblePeople: { type: "integer", minimum: 1 },
  },
  required: ["programSpend", "suppliedEligiblePeople"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spendPerEligiblePerson: { type: "number" } },
  required: ["spendPerEligiblePerson"],
} as const;
/** Divide explicit program spend by a supplied positive eligible-person count without defining eligibility or evaluating effectiveness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { programSpend, suppliedEligiblePeople } = request;
  const compute = (): Output => {
    H.domain(programSpend >= 0, "programSpend");
    (H.domain(
      Number.isSafeInteger(suppliedEligiblePeople) &&
        suppliedEligiblePeople >= 1 &&
        suppliedEligiblePeople <= Number.MAX_SAFE_INTEGER,
      "suppliedEligiblePeople",
    ),
      suppliedEligiblePeople);
    return { spendPerEligiblePerson: programSpend / suppliedEligiblePeople };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { programSpend: 10000, suppliedEligiblePeople: 200 },
  output: { spendPerEligiblePerson: 50 },
} satisfies ToolExample<Input, Output>;
export const programSpendEligiblePopulationShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["public-policy", "public policy", "social sciences"],
        keywords: ["public policy", "social sciences"],
      },
      id: "public-policy/program-spend-eligible-population-share",
      title: "Program Spend Eligible Population Share",
      description:
        "Divide explicit program spend by a supplied positive eligible-person count without defining eligibility or evaluating effectiveness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          programSpend: { type: "number", minimum: 0 },
          suppliedEligiblePeople: { type: "integer", minimum: 1 },
        },
        required: ["programSpend", "suppliedEligiblePeople"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { spendPerEligiblePerson: { type: "number" } },
        required: ["spendPerEligiblePerson"],
      },
      ports: {
        inputs: [
          {
            id: "programSpend",
            label: "Program Spend",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedEligiblePeople",
            label: "Supplied Eligible People",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "spendPerEligiblePerson",
            label: "Spend Per Eligible Person",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = programSpendEligiblePopulationShareTool.execute;
export default programSpendEligiblePopulationShareTool;
