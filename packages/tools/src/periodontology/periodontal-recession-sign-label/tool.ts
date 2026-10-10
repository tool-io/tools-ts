import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedDistance: number;
  readonly positiveMeansApical: boolean;
};
export type Output = {
  readonly apicalPositiveDistance: number;
  readonly signLabel: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDistance: { type: "number" },
    positiveMeansApical: { type: "boolean" },
  },
  required: ["signedDistance", "positiveMeansApical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    apicalPositiveDistance: { type: "number" },
    signLabel: { type: "string", maxLength: 8192 },
  },
  required: ["apicalPositiveDistance", "signLabel"],
} as const;
/** Crosswalk an explicit gingival-margin distance to an apical-positive sign convention without assessing disease. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedDistance, positiveMeansApical } = request;
  const compute = (): Output => {
    return (() => {
      const apicalPositiveDistance =
        signedDistance * (positiveMeansApical ? 1 : -1);
      return {
        apicalPositiveDistance,
        signLabel:
          apicalPositiveDistance > 0
            ? "apical"
            : apicalPositiveDistance < 0
              ? "coronal"
              : "at reference",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedDistance: 2, positiveMeansApical: true },
  output: { apicalPositiveDistance: 2, signLabel: "apical" },
} satisfies ToolExample<Input, Output>;
export const periodontalRecessionSignLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["periodontology", "health and medicine"],
      keywords: ["periodontology", "health and medicine"],
    },
    id: "periodontology/periodontal-recession-sign-label",
    title: "Periodontal Recession Sign Label",
    description:
      "Crosswalk an explicit gingival-margin distance to an apical-positive sign convention without assessing disease.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDistance: { type: "number" },
        positiveMeansApical: { type: "boolean" },
      },
      required: ["signedDistance", "positiveMeansApical"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        apicalPositiveDistance: { type: "number" },
        signLabel: { type: "string", maxLength: 8192 },
      },
      required: ["apicalPositiveDistance", "signLabel"],
    },
    ports: {
      inputs: [
        {
          id: "signedDistance",
          label: "Signed Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansApical",
          label: "Positive Means Apical",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "apicalPositiveDistance",
          label: "Apical Positive Distance",
          valueType: { type: "number" },
        },
        { id: "signLabel", label: "Sign Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = periodontalRecessionSignLabelTool.execute;
export default periodontalRecessionSignLabelTool;
