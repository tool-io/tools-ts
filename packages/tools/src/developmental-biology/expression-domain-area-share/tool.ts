import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly domainArea: number;
  readonly measuredTissueArea: number;
};
export type Output = {
  readonly domainFraction: number;
  readonly otherArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domainArea: { type: "number", minimum: 0 },
    measuredTissueArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["domainArea", "measuredTissueArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domainFraction: { type: "number" },
    otherArea: { type: "number" },
  },
  required: ["domainFraction", "otherArea"],
} as const;
/** Describe a caller-segmented expression-domain area share without identifying genes, inferring expression or designing experiments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { domainArea, measuredTissueArea } = request;
  const compute = (): Output => {
    (H.domain(measuredTissueArea > 0, "measuredTissueArea"),
      measuredTissueArea);
    H.domain(domainArea >= 0 && domainArea <= measuredTissueArea, "domainArea");
    return {
      domainFraction: domainArea / measuredTissueArea,
      otherArea: measuredTissueArea - domainArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { domainArea: 12, measuredTissueArea: 40 },
  output: { domainFraction: 0.3, otherArea: 28 },
} satisfies ToolExample<Input, Output>;
export const expressionDomainAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["developmental-biology", "developmental biology", "biology"],
      keywords: ["developmental biology", "biology"],
    },
    id: "developmental-biology/expression-domain-area-share",
    title: "Expression Domain Area Share",
    description:
      "Describe a caller-segmented expression-domain area share without identifying genes, inferring expression or designing experiments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domainArea: { type: "number", minimum: 0 },
        measuredTissueArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["domainArea", "measuredTissueArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domainFraction: { type: "number" },
        otherArea: { type: "number" },
      },
      required: ["domainFraction", "otherArea"],
    },
    ports: {
      inputs: [
        {
          id: "domainArea",
          label: "Domain Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredTissueArea",
          label: "Measured Tissue Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "domainFraction",
          label: "Domain Fraction",
          valueType: { type: "number" },
        },
        { id: "otherArea", label: "Other Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = expressionDomainAreaShareTool.execute;
export default expressionDomainAreaShareTool;
