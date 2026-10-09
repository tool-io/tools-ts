import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packageId: string;
  readonly sealReadingText: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageId: { type: "string", maxLength: 8192, minLength: 1 },
    sealReadingText: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["packageId", "sealReadingText", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit package-seal reading and unit text without assessing seal integrity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packageId, sealReadingText, unitText } = request;
  const compute = (): Output => {
    H.domain(packageId.length > 0, "packageId");
    H.domain(sealReadingText.length > 0, "sealReadingText");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([packageId, sealReadingText, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packageId: "PK17", sealReadingText: "12", unitText: "N" },
  output: { token: '["PK17","12","N"]' },
} satisfies ToolExample<Input, Output>;
export const foodPackageSealReadingUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["food-safety", "food safety", "research and quality management"],
      keywords: ["food safety", "research and quality management"],
    },
    id: "food-safety/food-package-seal-reading-unit",
    title: "Food Package Seal Reading Unit",
    description:
      "Preserve explicit package-seal reading and unit text without assessing seal integrity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packageId: { type: "string", maxLength: 8192, minLength: 1 },
        sealReadingText: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["packageId", "sealReadingText", "unitText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "packageId",
          label: "Package Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sealReadingText",
          label: "Seal Reading Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = foodPackageSealReadingUnitTool.execute;
export default foodPackageSealReadingUnitTool;
