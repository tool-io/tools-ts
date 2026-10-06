import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimText: string;
  readonly qualification: string;
};
export type Output = { readonly qualifiedClaim: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimText: { type: "string", maxLength: 8192, minLength: 1 },
    qualification: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["claimText", "qualification"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { qualifiedClaim: { type: "string", maxLength: 8192 } },
  required: ["qualifiedClaim"],
} as const;
/** Attach a caller-supplied qualification to a literal claim without evaluating its truth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimText, qualification } = request;
  const compute = (): Output => {
    H.domain(claimText.length > 0 && qualification.length > 0, "claimText");
    return { qualifiedClaim: claimText + " [" + qualification + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimText: "The estimate applies",
    qualification: "under stated assumptions",
  },
  output: { qualifiedClaim: "The estimate applies [under stated assumptions]" },
} satisfies ToolExample<Input, Output>;
export const claimQualificationMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/claim-qualification-marker",
    title: "Claim Qualification Marker",
    description:
      "Attach a caller-supplied qualification to a literal claim without evaluating its truth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimText: { type: "string", maxLength: 8192, minLength: 1 },
        qualification: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["claimText", "qualification"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { qualifiedClaim: { type: "string", maxLength: 8192 } },
      required: ["qualifiedClaim"],
    },
    ports: {
      inputs: [
        {
          id: "claimText",
          label: "Claim Text",
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
        {
          id: "qualifiedClaim",
          label: "Qualified Claim",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = claimQualificationMarkerTool.execute;
export default claimQualificationMarkerTool;
