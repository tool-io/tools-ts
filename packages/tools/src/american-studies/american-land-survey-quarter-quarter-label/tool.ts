import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionReference: string;
  readonly parentQuarter: string;
  readonly childQuarter: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionReference: { type: "string", maxLength: 8192, minLength: 1 },
    parentQuarter: {
      type: "string",
      maxLength: 8192,
      enum: ["NE", "NW", "SE", "SW"],
    },
    childQuarter: {
      type: "string",
      maxLength: 8192,
      enum: ["NE", "NW", "SE", "SW"],
    },
  },
  required: ["sectionReference", "parentQuarter", "childQuarter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicitly supplied parent and child quarter-section labels without locating land or calculating legal area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionReference, parentQuarter, childQuarter } = request;
  const compute = (): Output => {
    H.domain(sectionReference.length > 0, "sectionReference");
    H.domain(["NE", "NW", "SE", "SW"].includes(parentQuarter), "parentQuarter");
    H.domain(["NE", "NW", "SE", "SW"].includes(childQuarter), "childQuarter");
    return {
      label: childQuarter + "¼ of " + parentQuarter + "¼; " + sectionReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sectionReference: "Section 17",
    parentQuarter: "NW",
    childQuarter: "SE",
  },
  output: { label: "SE¼ of NW¼; Section 17" },
} satisfies ToolExample<Input, Output>;
export const americanLandSurveyQuarterQuarterLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["american-studies", "american studies", "humanities"],
        keywords: ["american studies", "humanities"],
      },
      id: "american-studies/american-land-survey-quarter-quarter-label",
      title: "American Land Survey Quarter Quarter Label",
      description:
        "Format explicitly supplied parent and child quarter-section labels without locating land or calculating legal area.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sectionReference: { type: "string", maxLength: 8192, minLength: 1 },
          parentQuarter: {
            type: "string",
            maxLength: 8192,
            enum: ["NE", "NW", "SE", "SW"],
          },
          childQuarter: {
            type: "string",
            maxLength: 8192,
            enum: ["NE", "NW", "SE", "SW"],
          },
        },
        required: ["sectionReference", "parentQuarter", "childQuarter"],
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
            id: "sectionReference",
            label: "Section Reference",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "parentQuarter",
            label: "Parent Quarter",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "childQuarter",
            label: "Child Quarter",
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
export const run = americanLandSurveyQuarterQuarterLabelTool.execute;
export default americanLandSurveyQuarterQuarterLabelTool;
