import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstContactMinutes: number;
  readonly secondContactMinutes: number;
  readonly commonAdministrativeMinutes: number;
  readonly removeCommon: boolean;
};
export type Output = {
  readonly firstAdjusted: number;
  readonly secondAdjusted: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstContactMinutes: { type: "number", minimum: 0 },
    secondContactMinutes: { type: "number", minimum: 0 },
    commonAdministrativeMinutes: { type: "number", minimum: 0 },
    removeCommon: { type: "boolean" },
  },
  required: [
    "firstContactMinutes",
    "secondContactMinutes",
    "commonAdministrativeMinutes",
    "removeCommon",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAdjusted: { type: "number" },
    secondAdjusted: { type: "number" },
    gap: { type: "number" },
  },
  required: ["firstAdjusted", "secondAdjusted", "gap"],
} as const;
/** Compare supplied research arm contact durations under a shared administrative-time exclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstContactMinutes,
    secondContactMinutes,
    commonAdministrativeMinutes,
    removeCommon,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstContactMinutes >= 0 &&
        secondContactMinutes >= 0 &&
        commonAdministrativeMinutes >= 0 &&
        commonAdministrativeMinutes <=
          Math.min(firstContactMinutes, secondContactMinutes),
    );
    return {
      firstAdjusted:
        firstContactMinutes - (removeCommon ? commonAdministrativeMinutes : 0),
      secondAdjusted:
        secondContactMinutes - (removeCommon ? commonAdministrativeMinutes : 0),
      gap: firstContactMinutes - secondContactMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstContactMinutes: 60,
    secondContactMinutes: 40,
    commonAdministrativeMinutes: 10,
    removeCommon: true,
  },
  output: { firstAdjusted: 50, secondAdjusted: 30, gap: 20 },
} satisfies ToolExample<Input, Output>;
export const studyArmContactBaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/study-arm-contact-base-gap",
    title: "Study Arm Contact Base Gap Tool",
    description:
      "Compare supplied research arm contact durations under a shared administrative-time exclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstContactMinutes: { type: "number", minimum: 0 },
        secondContactMinutes: { type: "number", minimum: 0 },
        commonAdministrativeMinutes: { type: "number", minimum: 0 },
        removeCommon: { type: "boolean" },
      },
      required: [
        "firstContactMinutes",
        "secondContactMinutes",
        "commonAdministrativeMinutes",
        "removeCommon",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAdjusted: { type: "number" },
        secondAdjusted: { type: "number" },
        gap: { type: "number" },
      },
      required: ["firstAdjusted", "secondAdjusted", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "firstContactMinutes",
          label: "First Contact Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondContactMinutes",
          label: "Second Contact Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commonAdministrativeMinutes",
          label: "Common Administrative Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removeCommon",
          label: "Remove Common",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "firstAdjusted",
          label: "First Adjusted",
          valueType: { type: "number" },
        },
        {
          id: "secondAdjusted",
          label: "Second Adjusted",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = studyArmContactBaseGapTool.execute;
export default studyArmContactBaseGapTool;
