import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeMinutes: number;
  readonly shamMinutes: number;
  readonly sharedMinutes: number;
  readonly totalAvailable: number;
};
export type Output = {
  readonly uniqueContact: number;
  readonly activeShare: number;
  readonly shamShare: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMinutes: { type: "number", minimum: 0 },
    shamMinutes: { type: "number", minimum: 0 },
    sharedMinutes: { type: "number", minimum: 0 },
    totalAvailable: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["activeMinutes", "shamMinutes", "sharedMinutes", "totalAvailable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueContact: { type: "number" },
    activeShare: { type: "number" },
    shamShare: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["uniqueContact", "activeShare", "shamShare", "remaining"],
} as const;
/** Calculate osteopathic study control time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeMinutes, shamMinutes, sharedMinutes, totalAvailable } = request;
  const compute = (): Output => {
    H.positive(totalAvailable);
    H.domain(
      activeMinutes >= 0 &&
        shamMinutes >= 0 &&
        sharedMinutes >= 0 &&
        sharedMinutes <= Math.min(activeMinutes, shamMinutes) &&
        activeMinutes + shamMinutes - sharedMinutes <= totalAvailable,
    );
    return {
      uniqueContact: activeMinutes + shamMinutes - sharedMinutes,
      activeShare: activeMinutes / totalAvailable,
      shamShare: shamMinutes / totalAvailable,
      remaining: totalAvailable - activeMinutes - shamMinutes + sharedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activeMinutes: 30,
    shamMinutes: 25,
    sharedMinutes: 5,
    totalAvailable: 60,
  },
  output: {
    uniqueContact: 50,
    activeShare: 0.5,
    shamShare: 0.4166666666666667,
    remaining: 10,
  },
} satisfies ToolExample<Input, Output>;
export const osteopathicStudyControlTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/osteopathic-study-control-time-share",
    title: "Osteopathic Study Control Time Share Tool",
    description:
      "Calculate osteopathic study control time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMinutes: { type: "number", minimum: 0 },
        shamMinutes: { type: "number", minimum: 0 },
        sharedMinutes: { type: "number", minimum: 0 },
        totalAvailable: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "activeMinutes",
        "shamMinutes",
        "sharedMinutes",
        "totalAvailable",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueContact: { type: "number" },
        activeShare: { type: "number" },
        shamShare: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["uniqueContact", "activeShare", "shamShare", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "activeMinutes",
          label: "Active Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shamMinutes",
          label: "Sham Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedMinutes",
          label: "Shared Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalAvailable",
          label: "Total Available",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueContact",
          label: "Unique Contact",
          valueType: { type: "number" },
        },
        {
          id: "activeShare",
          label: "Active Share",
          valueType: { type: "number" },
        },
        { id: "shamShare", label: "Sham Share", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = osteopathicStudyControlTimeShareTool.execute;
export default osteopathicStudyControlTimeShareTool;
