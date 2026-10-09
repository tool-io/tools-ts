import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly controlPointId: string;
  readonly recordedLimitText: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    controlPointId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedLimitText: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["controlPointId", "recordedLimitText", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit HACCP recorded-limit text and units without choosing or validating critical limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { controlPointId, recordedLimitText, unitText } = request;
  const compute = (): Output => {
    H.domain(controlPointId.length > 0, "controlPointId");
    H.domain(recordedLimitText.length > 0, "recordedLimitText");
    H.domain(unitText.length > 0, "unitText");
    return {
      token: JSON.stringify([controlPointId, recordedLimitText, unitText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    controlPointId: "CP17",
    recordedLimitText: "75",
    unitText: "degrees C",
  },
  output: { token: '["CP17","75","degrees C"]' },
} satisfies ToolExample<Input, Output>;
export const haccpRecordedLimitUnitPairTool = H.defineSchemaCalculation<
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
    id: "food-safety/haccp-recorded-limit-unit-pair",
    title: "HACCP Recorded Limit Unit Pair",
    description:
      "Preserve explicit HACCP recorded-limit text and units without choosing or validating critical limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        controlPointId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedLimitText: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["controlPointId", "recordedLimitText", "unitText"],
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
          id: "controlPointId",
          label: "Control Point Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedLimitText",
          label: "Recorded Limit Text",
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
export const run = haccpRecordedLimitUnitPairTool.execute;
export default haccpRecordedLimitUnitPairTool;
