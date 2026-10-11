import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly knownPart: number;
  readonly suppliedKnownToMissingRatio: number;
};
export type Output = { readonly missingPart: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownPart: { type: "number", minimum: 0 },
    suppliedKnownToMissingRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["knownPart", "suppliedKnownToMissingRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missingPart: { type: "number" } },
  required: ["missingPart"],
} as const;
/** Recover one nonnegative missing part from an explicit known-part to missing-part ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knownPart, suppliedKnownToMissingRatio } = request;
  const compute = (): Output => {
    H.domain(knownPart >= 0, "knownPart");
    (H.domain(
      Number.isFinite(suppliedKnownToMissingRatio) &&
        suppliedKnownToMissingRatio > 0,
      "suppliedKnownToMissingRatio",
    ),
      suppliedKnownToMissingRatio);
    return { missingPart: knownPart / suppliedKnownToMissingRatio };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { knownPart: 12, suppliedKnownToMissingRatio: 3 },
  output: { missingPart: 4 },
} satisfies ToolExample<Input, Output>;
export const targetRatioMissingPartTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["proportions", "mathematics"],
      keywords: ["proportions", "mathematics"],
    },
    id: "proportions/target-ratio-missing-part",
    title: "Target Ratio Missing Part",
    description:
      "Recover one nonnegative missing part from an explicit known-part to missing-part ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownPart: { type: "number", minimum: 0 },
        suppliedKnownToMissingRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["knownPart", "suppliedKnownToMissingRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { missingPart: { type: "number" } },
      required: ["missingPart"],
    },
    ports: {
      inputs: [
        {
          id: "knownPart",
          label: "Known Part",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedKnownToMissingRatio",
          label: "Supplied Known To Missing Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "missingPart",
          label: "Missing Part",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = targetRatioMissingPartTool.execute;
export default targetRatioMissingPartTool;
