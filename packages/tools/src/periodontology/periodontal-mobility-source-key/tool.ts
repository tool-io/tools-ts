import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothCode: string;
  readonly recordedMobilityCode: string;
  readonly classificationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordedMobilityCode: { type: "string", maxLength: 8192, minLength: 1 },
    classificationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["toothCode", "recordedMobilityCode", "classificationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied tooth-mobility code by its explicit classification source without assessing mobility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothCode, recordedMobilityCode, classificationSource } = request;
  const compute = (): Output => {
    H.domain(toothCode.length > 0, "toothCode");
    H.domain(recordedMobilityCode.length > 0, "recordedMobilityCode");
    H.domain(classificationSource.length > 0, "classificationSource");
    return {
      token: JSON.stringify([
        toothCode,
        recordedMobilityCode,
        classificationSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    toothCode: "T17",
    recordedMobilityCode: "M1",
    classificationSource: "Scale A",
  },
  output: { token: '["T17","M1","Scale A"]' },
} satisfies ToolExample<Input, Output>;
export const periodontalMobilitySourceKeyTool = H.defineSchemaCalculation<
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
    id: "periodontology/periodontal-mobility-source-key",
    title: "Periodontal Mobility Source Key",
    description:
      "Qualify a supplied tooth-mobility code by its explicit classification source without assessing mobility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordedMobilityCode: { type: "string", maxLength: 8192, minLength: 1 },
        classificationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["toothCode", "recordedMobilityCode", "classificationSource"],
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
          id: "toothCode",
          label: "Tooth Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedMobilityCode",
          label: "Recorded Mobility Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "classificationSource",
          label: "Classification Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = periodontalMobilitySourceKeyTool.execute;
export default periodontalMobilitySourceKeyTool;
