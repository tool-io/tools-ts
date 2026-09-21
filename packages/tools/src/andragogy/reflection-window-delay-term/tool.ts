import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityEnd: number;
  readonly reflectionTime: number;
  readonly earliestDelay: number;
  readonly latestDelay: number;
};
export type Output = { readonly delay: number; readonly withinWindow: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityEnd: { type: "number" },
    reflectionTime: { type: "number" },
    earliestDelay: { type: "number", minimum: 0 },
    latestDelay: { type: "number" },
  },
  required: ["activityEnd", "reflectionTime", "earliestDelay", "latestDelay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delay: { type: "number" }, withinWindow: { type: "boolean" } },
  required: ["delay", "withinWindow"],
} as const;
/** Calculate reflection window delay term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityEnd, reflectionTime, earliestDelay, latestDelay } = request;
  const compute = (): Output => {
    H.domain(latestDelay >= earliestDelay && earliestDelay >= 0);
    return {
      delay: reflectionTime - activityEnd,
      withinWindow:
        reflectionTime - activityEnd >= earliestDelay &&
        reflectionTime - activityEnd <= latestDelay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activityEnd: 10,
    reflectionTime: 15,
    earliestDelay: 2,
    latestDelay: 8,
  },
  output: { delay: 5, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const reflectionWindowDelayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/reflection-window-delay-term",
    title: "Reflection Window Delay Term Tool",
    description:
      "Calculate reflection window delay term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activityEnd: { type: "number" },
        reflectionTime: { type: "number" },
        earliestDelay: { type: "number", minimum: 0 },
        latestDelay: { type: "number" },
      },
      required: [
        "activityEnd",
        "reflectionTime",
        "earliestDelay",
        "latestDelay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delay: { type: "number" },
        withinWindow: { type: "boolean" },
      },
      required: ["delay", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "activityEnd",
          label: "Activity End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reflectionTime",
          label: "Reflection Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earliestDelay",
          label: "Earliest Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestDelay",
          label: "Latest Delay",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "delay", label: "Delay", valueType: { type: "number" } },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = reflectionWindowDelayTermTool.execute;
export default reflectionWindowDelayTermTool;
