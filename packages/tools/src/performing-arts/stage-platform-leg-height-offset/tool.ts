import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetTop: number;
  readonly deckThickness: number;
  readonly casterHeight: number;
  readonly floorHeight: number;
};
export type Output = { readonly legHeight: number; readonly feasible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetTop: { type: "number" },
    deckThickness: { type: "number", minimum: 0 },
    casterHeight: { type: "number", minimum: 0 },
    floorHeight: { type: "number" },
  },
  required: ["targetTop", "deckThickness", "casterHeight", "floorHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { legHeight: { type: "number" }, feasible: { type: "boolean" } },
  required: ["legHeight", "feasible"],
} as const;
/** Calculate stage platform leg height offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetTop, deckThickness, casterHeight, floorHeight } = request;
  const compute = (): Output => {
    H.domain(deckThickness >= 0 && casterHeight >= 0);
    return {
      legHeight: targetTop - deckThickness - casterHeight - floorHeight,
      feasible: targetTop >= deckThickness + casterHeight + floorHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetTop: 1,
    deckThickness: 0.1,
    casterHeight: 0.2,
    floorHeight: 0,
  },
  output: { legHeight: 0.7, feasible: true },
} satisfies ToolExample<Input, Output>;
export const stagePlatformLegHeightOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/stage-platform-leg-height-offset",
    title: "Stage Platform Leg Height Offset Tool",
    description:
      "Calculate stage platform leg height offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetTop: { type: "number" },
        deckThickness: { type: "number", minimum: 0 },
        casterHeight: { type: "number", minimum: 0 },
        floorHeight: { type: "number" },
      },
      required: ["targetTop", "deckThickness", "casterHeight", "floorHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        legHeight: { type: "number" },
        feasible: { type: "boolean" },
      },
      required: ["legHeight", "feasible"],
    },
    ports: {
      inputs: [
        {
          id: "targetTop",
          label: "Target Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deckThickness",
          label: "Deck Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "casterHeight",
          label: "Caster Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floorHeight",
          label: "Floor Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "legHeight", label: "Leg Height", valueType: { type: "number" } },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stagePlatformLegHeightOffsetTool.execute;
export default stagePlatformLegHeightOffsetTool;
