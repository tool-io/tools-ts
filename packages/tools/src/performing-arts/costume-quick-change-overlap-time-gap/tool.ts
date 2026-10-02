import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exitTime: number;
  readonly nextEntrance: number;
  readonly changeSeconds: number;
  readonly travelSeconds: number;
};
export type Output = { readonly available: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exitTime: { type: "number" },
    nextEntrance: { type: "number" },
    changeSeconds: { type: "number", minimum: 0 },
    travelSeconds: { type: "number", minimum: 0 },
  },
  required: ["exitTime", "nextEntrance", "changeSeconds", "travelSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "number" }, margin: { type: "number" } },
  required: ["available", "margin"],
} as const;
/** Calculate costume quick change overlap time gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exitTime, nextEntrance, changeSeconds, travelSeconds } = request;
  const compute = (): Output => {
    H.domain(
      nextEntrance >= exitTime && changeSeconds >= 0 && travelSeconds >= 0,
    );
    return {
      available: nextEntrance - exitTime,
      margin: nextEntrance - exitTime - changeSeconds - travelSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exitTime: 100,
    nextEntrance: 160,
    changeSeconds: 40,
    travelSeconds: 10,
  },
  output: { available: 60, margin: 10 },
} satisfies ToolExample<Input, Output>;
export const costumeQuickChangeOverlapTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/costume-quick-change-overlap-time-gap",
    title: "Costume Quick Change Overlap Time Gap Tool",
    description:
      "Calculate costume quick change overlap time gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exitTime: { type: "number" },
        nextEntrance: { type: "number" },
        changeSeconds: { type: "number", minimum: 0 },
        travelSeconds: { type: "number", minimum: 0 },
      },
      required: ["exitTime", "nextEntrance", "changeSeconds", "travelSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { available: { type: "number" }, margin: { type: "number" } },
      required: ["available", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "exitTime",
          label: "Exit Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextEntrance",
          label: "Next Entrance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "changeSeconds",
          label: "Change Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelSeconds",
          label: "Travel Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = costumeQuickChangeOverlapTimeGapTool.execute;
export default costumeQuickChangeOverlapTimeGapTool;
