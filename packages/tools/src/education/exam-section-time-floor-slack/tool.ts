import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMinutes: number;
  readonly fixedMinutes: number;
  readonly sectionFloors: readonly number[];
};
export type Output = {
  readonly requiredMinutes: number;
  readonly slack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMinutes: { type: "number", minimum: 0 },
    fixedMinutes: { type: "number", minimum: 0 },
    sectionFloors: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["totalMinutes", "fixedMinutes", "sectionFloors"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredMinutes: { type: "number" },
    slack: { type: "number" },
  },
  required: ["requiredMinutes", "slack"],
} as const;
/** Calculate exam section time floor slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMinutes, fixedMinutes, sectionFloors } = request;
  const compute = (): Output => {
    H.domain(
      totalMinutes >= 0 &&
        fixedMinutes >= 0 &&
        sectionFloors.every((x) => x >= 0),
    );
    return {
      requiredMinutes: fixedMinutes + sectionFloors.reduce((a, b) => a + b, 0),
      slack:
        totalMinutes - fixedMinutes - sectionFloors.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMinutes: 120, fixedMinutes: 10, sectionFloors: [30, 40] },
  output: { requiredMinutes: 80, slack: 40 },
} satisfies ToolExample<Input, Output>;
export const examSectionTimeFloorSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/exam-section-time-floor-slack",
    title: "Exam Section Time Floor Slack Tool",
    description:
      "Calculate exam section time floor slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMinutes: { type: "number", minimum: 0 },
        fixedMinutes: { type: "number", minimum: 0 },
        sectionFloors: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["totalMinutes", "fixedMinutes", "sectionFloors"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredMinutes: { type: "number" },
        slack: { type: "number" },
      },
      required: ["requiredMinutes", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "totalMinutes",
          label: "Total Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedMinutes",
          label: "Fixed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sectionFloors",
          label: "Section Floors",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "requiredMinutes",
          label: "Required Minutes",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = examSectionTimeFloorSlackTool.execute;
export default examSectionTimeFloorSlackTool;
