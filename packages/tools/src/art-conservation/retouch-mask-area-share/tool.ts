import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retouchArea: number;
  readonly examinedSurfaceArea: number;
};
export type Output = {
  readonly retouchFraction: number;
  readonly unmaskedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retouchArea: { type: "number", minimum: 0 },
    examinedSurfaceArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["retouchArea", "examinedSurfaceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retouchFraction: { type: "number" },
    unmaskedArea: { type: "number" },
  },
  required: ["retouchFraction", "unmaskedArea"],
} as const;
/** Describe a measured retouch mask’s area share on one explicit examined surface without identifying original material. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retouchArea, examinedSurfaceArea } = request;
  const compute = (): Output => {
    (H.domain(examinedSurfaceArea > 0, "examinedSurfaceArea"),
      examinedSurfaceArea);
    H.domain(
      retouchArea >= 0 && retouchArea <= examinedSurfaceArea,
      "retouchArea",
    );
    return {
      retouchFraction: retouchArea / examinedSurfaceArea,
      unmaskedArea: examinedSurfaceArea - retouchArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retouchArea: 12, examinedSurfaceArea: 80 },
  output: { retouchFraction: 0.15, unmaskedArea: 68 },
} satisfies ToolExample<Input, Output>;
export const retouchMaskAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/retouch-mask-area-share",
    title: "Retouch Mask Area Share",
    description:
      "Describe a measured retouch mask’s area share on one explicit examined surface without identifying original material.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retouchArea: { type: "number", minimum: 0 },
        examinedSurfaceArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["retouchArea", "examinedSurfaceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retouchFraction: { type: "number" },
        unmaskedArea: { type: "number" },
      },
      required: ["retouchFraction", "unmaskedArea"],
    },
    ports: {
      inputs: [
        {
          id: "retouchArea",
          label: "Retouch Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "examinedSurfaceArea",
          label: "Examined Surface Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retouchFraction",
          label: "Retouch Fraction",
          valueType: { type: "number" },
        },
        {
          id: "unmaskedArea",
          label: "Unmasked Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retouchMaskAreaShareTool.execute;
export default retouchMaskAreaShareTool;
