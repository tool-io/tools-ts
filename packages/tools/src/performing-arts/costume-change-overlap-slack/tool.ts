import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMinutes: number;
  readonly dressMinutes: number;
  readonly travelMinutes: number;
  readonly overlap: number;
};
export type Output = {
  readonly requiredMinutes: number;
  readonly slack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number", minimum: 0 },
    dressMinutes: { type: "number", minimum: 0 },
    travelMinutes: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["availableMinutes", "dressMinutes", "travelMinutes", "overlap"],
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
/** Calculate costume change overlap slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMinutes, dressMinutes, travelMinutes, overlap } = request;
  const compute = (): Output => {
    H.domain(
      availableMinutes >= 0 &&
        dressMinutes >= 0 &&
        travelMinutes >= 0 &&
        overlap >= 0 &&
        overlap <= Math.min(dressMinutes, travelMinutes),
    );
    return {
      requiredMinutes: dressMinutes + travelMinutes - overlap,
      slack: availableMinutes - dressMinutes - travelMinutes + overlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableMinutes: 5, dressMinutes: 3, travelMinutes: 2, overlap: 1 },
  output: { requiredMinutes: 4, slack: 1 },
} satisfies ToolExample<Input, Output>;
export const costumeChangeOverlapSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/costume-change-overlap-slack",
    title: "Costume Change Overlap Slack Tool",
    description:
      "Calculate costume change overlap slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number", minimum: 0 },
        dressMinutes: { type: "number", minimum: 0 },
        travelMinutes: { type: "number", minimum: 0 },
        overlap: { type: "number", minimum: 0 },
      },
      required: [
        "availableMinutes",
        "dressMinutes",
        "travelMinutes",
        "overlap",
      ],
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
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dressMinutes",
          label: "Dress Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelMinutes",
          label: "Travel Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
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
export const run = costumeChangeOverlapSlackTool.execute;
export default costumeChangeOverlapSlackTool;
