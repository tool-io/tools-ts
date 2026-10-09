import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimId: string;
  readonly qualification: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192, minLength: 1 },
    qualification: {
      type: "string",
      maxLength: 8192,
      enum: ["qualified", "unqualified", "unclear"],
    },
  },
  required: ["claimId", "qualification"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly annotated evidence-claim qualification without assessing truth or sufficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, qualification } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0, "claimId");
    H.domain(
      ["qualified", "unqualified", "unclear"].includes(qualification),
      "qualification",
    );
    return { label: claimId + " [" + qualification + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimId: "CL17", qualification: "qualified" },
  output: { label: "CL17 [qualified]" },
} satisfies ToolExample<Input, Output>;
export const evidenceClaimQualifiedUnqualifiedTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["ethics", "philosophy"],
        keywords: ["ethics", "philosophy"],
      },
      id: "ethics/evidence-claim-qualified-unqualified-tag",
      title: "Evidence Claim Qualified Unqualified Tag",
      description:
        "Label an explicitly annotated evidence-claim qualification without assessing truth or sufficiency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          claimId: { type: "string", maxLength: 8192, minLength: 1 },
          qualification: {
            type: "string",
            maxLength: 8192,
            enum: ["qualified", "unqualified", "unclear"],
          },
        },
        required: ["claimId", "qualification"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "claimId",
            label: "Claim Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "qualification",
            label: "Qualification",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = evidenceClaimQualifiedUnqualifiedTagTool.execute;
export default evidenceClaimQualifiedUnqualifiedTagTool;
