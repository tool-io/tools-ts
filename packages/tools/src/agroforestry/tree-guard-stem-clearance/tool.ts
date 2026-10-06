import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly guardInnerDiameter: number;
  readonly stemDiameter: number;
};
export type Output = {
  readonly diametralClearance: number;
  readonly radialClearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guardInnerDiameter: { type: "number", minimum: 0 },
    stemDiameter: { type: "number", minimum: 0 },
  },
  required: ["guardInnerDiameter", "stemDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diametralClearance: { type: "number" },
    radialClearance: { type: "number" },
  },
  required: ["diametralClearance", "radialClearance"],
} as const;
/** Compare explicit guard and stem diameters without selecting protection or fit requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { guardInnerDiameter, stemDiameter } = request;
  const compute = (): Output => {
    H.domain(
      guardInnerDiameter >= 0 && stemDiameter >= 0,
      "guardInnerDiameter",
    );
    return {
      diametralClearance: guardInnerDiameter - stemDiameter,
      radialClearance: (guardInnerDiameter - stemDiameter) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { guardInnerDiameter: 20, stemDiameter: 8 },
  output: { diametralClearance: 12, radialClearance: 6 },
} satisfies ToolExample<Input, Output>;
export const treeGuardStemClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroforestry", "agriculture"],
      keywords: ["agroforestry", "agriculture"],
    },
    id: "agroforestry/tree-guard-stem-clearance",
    title: "Tree Guard Stem Clearance",
    description:
      "Compare explicit guard and stem diameters without selecting protection or fit requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        guardInnerDiameter: { type: "number", minimum: 0 },
        stemDiameter: { type: "number", minimum: 0 },
      },
      required: ["guardInnerDiameter", "stemDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diametralClearance: { type: "number" },
        radialClearance: { type: "number" },
      },
      required: ["diametralClearance", "radialClearance"],
    },
    ports: {
      inputs: [
        {
          id: "guardInnerDiameter",
          label: "Guard Inner Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stemDiameter",
          label: "Stem Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "diametralClearance",
          label: "Diametral Clearance",
          valueType: { type: "number" },
        },
        {
          id: "radialClearance",
          label: "Radial Clearance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeGuardStemClearanceTool.execute;
export default treeGuardStemClearanceTool;
