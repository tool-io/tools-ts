import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rcode: number;
  readonly answerCount: number;
  readonly authoritative: boolean;
};
export type Output = {
  readonly headerClass: string;
  readonly nodataProven: boolean;
  readonly authoritative: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rcode: { type: "integer", minimum: 0, maximum: 15 },
    answerCount: { type: "integer", minimum: 0, maximum: 65535 },
    authoritative: { type: "boolean" },
  },
  required: ["rcode", "answerCount", "authoritative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headerClass: { type: "string", maxLength: 8192 },
    nodataProven: { type: "boolean" },
    authoritative: { type: "boolean" },
  },
  required: ["headerClass", "nodataProven", "authoritative"],
} as const;
/** Headers distinguish NXDOMAIN from NOERROR with an empty answer; NODATA still requires message-level context. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rcode, answerCount, authoritative } = request;
  const compute = (): Output => {
    H.integer(rcode, 0, 15);
    H.integer(answerCount, 0, 65535);
    return {
      headerClass:
        rcode === 3
          ? "nxdomain"
          : rcode === 0 && answerCount === 0
            ? "noerror-empty-answer"
            : rcode === 0
              ? "noerror-answer"
              : "other-error",
      nodataProven: false,
      authoritative,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rcode: 3, answerCount: 0, authoritative: true },
  output: { headerClass: "nxdomain", nodataProven: false, authoritative: true },
} satisfies ToolExample<Input, Output>;
export const dnsNxdomainNodataHeaderDistinctionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/dns-nxdomain-nodata-header-distinction",
    title: "DNS NXDOMAIN NODATA Header Distinction Tool",
    description:
      "Headers distinguish NXDOMAIN from NOERROR with an empty answer; NODATA still requires message-level context.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rcode: { type: "integer", minimum: 0, maximum: 15 },
        answerCount: { type: "integer", minimum: 0, maximum: 65535 },
        authoritative: { type: "boolean" },
      },
      required: ["rcode", "answerCount", "authoritative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headerClass: { type: "string", maxLength: 8192 },
        nodataProven: { type: "boolean" },
        authoritative: { type: "boolean" },
      },
      required: ["headerClass", "nodataProven", "authoritative"],
    },
    ports: {
      inputs: [
        {
          id: "rcode",
          label: "Rcode",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "answerCount",
          label: "Answer Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "authoritative",
          label: "Authoritative",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "headerClass",
          label: "Header Class",
          valueType: { type: "string" },
        },
        {
          id: "nodataProven",
          label: "Nodata Proven",
          valueType: { type: "boolean" },
        },
        {
          id: "authoritative",
          label: "Authoritative",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dnsNxdomainNodataHeaderDistinctionTool.execute;
export default dnsNxdomainNodataHeaderDistinctionTool;
