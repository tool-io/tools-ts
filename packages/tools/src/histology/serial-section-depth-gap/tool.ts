import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSection: number;
  readonly secondSection: number;
  readonly sectionThickness: number;
  readonly interSectionGap: number;
  readonly suppliedDepthDifference: number;
};
export type Output = {
  readonly modelDepthDifference: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSection: { type: "integer", minimum: 0 },
    secondSection: { type: "integer", minimum: 0 },
    sectionThickness: { type: "number", exclusiveMinimum: 0 },
    interSectionGap: { type: "number", minimum: 0 },
    suppliedDepthDifference: { type: "number" },
  },
  required: [
    "firstSection",
    "secondSection",
    "sectionThickness",
    "interSectionGap",
    "suppliedDepthDifference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelDepthDifference: { type: "number" },
    residual: { type: "number" },
  },
  required: ["modelDepthDifference", "residual"],
} as const;
/** Calculate serial section depth gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstSection,
    secondSection,
    sectionThickness,
    interSectionGap,
    suppliedDepthDifference,
  } = request;
  const compute = (): Output => {
    H.integer(firstSection, 0);
    H.integer(secondSection, 0);
    H.positive(sectionThickness);
    H.domain(interSectionGap >= 0);
    return (() => {
      const modelDepthDifference =
        Number(BigInt(secondSection) - BigInt(firstSection)) *
        (sectionThickness + interSectionGap);
      return {
        modelDepthDifference,
        residual: suppliedDepthDifference - modelDepthDifference,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSection: 2,
    secondSection: 5,
    sectionThickness: 2,
    interSectionGap: 1,
    suppliedDepthDifference: 10,
  },
  output: { modelDepthDifference: 9, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const serialSectionDepthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/serial-section-depth-gap",
    title: "Serial Section Depth Gap Tool",
    description:
      "Calculate serial section depth gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSection: { type: "integer", minimum: 0 },
        secondSection: { type: "integer", minimum: 0 },
        sectionThickness: { type: "number", exclusiveMinimum: 0 },
        interSectionGap: { type: "number", minimum: 0 },
        suppliedDepthDifference: { type: "number" },
      },
      required: [
        "firstSection",
        "secondSection",
        "sectionThickness",
        "interSectionGap",
        "suppliedDepthDifference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelDepthDifference: { type: "number" },
        residual: { type: "number" },
      },
      required: ["modelDepthDifference", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstSection",
          label: "First Section",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondSection",
          label: "Second Section",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sectionThickness",
          label: "Section Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interSectionGap",
          label: "Inter Section Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDepthDifference",
          label: "Supplied Depth Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "modelDepthDifference",
          label: "Model Depth Difference",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = serialSectionDepthGapTool.execute;
export default serialSectionDepthGapTool;
