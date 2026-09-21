import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly treeLitter: number;
  readonly cropLitter: number;
  readonly removedMass: number;
  readonly fieldArea: number;
  readonly treeArea: number;
  readonly reportTreeArea: boolean;
};
export type Output = {
  readonly returnedMass: number;
  readonly returnPerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treeLitter: { type: "number", minimum: 0 },
    cropLitter: { type: "number", minimum: 0 },
    removedMass: { type: "number", minimum: 0 },
    fieldArea: { type: "number", exclusiveMinimum: 0 },
    treeArea: { type: "number", exclusiveMinimum: 0 },
    reportTreeArea: { type: "boolean" },
  },
  required: [
    "treeLitter",
    "cropLitter",
    "removedMass",
    "fieldArea",
    "treeArea",
    "reportTreeArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnedMass: { type: "number" },
    returnPerArea: { type: "number" },
  },
  required: ["returnedMass", "returnPerArea"],
} as const;
/** Calculate tree crop litter return basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    treeLitter,
    cropLitter,
    removedMass,
    fieldArea,
    treeArea,
    reportTreeArea,
  } = request;
  const compute = (): Output => {
    H.positive(fieldArea);
    H.positive(treeArea);
    H.domain(
      treeLitter >= 0 &&
        cropLitter >= 0 &&
        removedMass >= 0 &&
        removedMass <= treeLitter + cropLitter &&
        treeArea <= fieldArea,
    );
    return {
      returnedMass: treeLitter + cropLitter - removedMass,
      returnPerArea:
        (treeLitter + cropLitter - removedMass) /
        (reportTreeArea ? treeArea : fieldArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    treeLitter: 30,
    cropLitter: 20,
    removedMass: 10,
    fieldArea: 100,
    treeArea: 20,
    reportTreeArea: true,
  },
  output: { returnedMass: 40, returnPerArea: 2 },
} satisfies ToolExample<Input, Output>;
export const treeCropLitterReturnBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-crop-litter-return-basis",
    title: "Tree Crop Litter Return Basis Tool",
    description:
      "Calculate tree crop litter return basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        treeLitter: { type: "number", minimum: 0 },
        cropLitter: { type: "number", minimum: 0 },
        removedMass: { type: "number", minimum: 0 },
        fieldArea: { type: "number", exclusiveMinimum: 0 },
        treeArea: { type: "number", exclusiveMinimum: 0 },
        reportTreeArea: { type: "boolean" },
      },
      required: [
        "treeLitter",
        "cropLitter",
        "removedMass",
        "fieldArea",
        "treeArea",
        "reportTreeArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnedMass: { type: "number" },
        returnPerArea: { type: "number" },
      },
      required: ["returnedMass", "returnPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "treeLitter",
          label: "Tree Litter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cropLitter",
          label: "Crop Litter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedMass",
          label: "Removed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fieldArea",
          label: "Field Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "treeArea",
          label: "Tree Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportTreeArea",
          label: "Report Tree Area",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "returnedMass",
          label: "Returned Mass",
          valueType: { type: "number" },
        },
        {
          id: "returnPerArea",
          label: "Return Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeCropLitterReturnBasisTool.execute;
export default treeCropLitterReturnBasisTool;
