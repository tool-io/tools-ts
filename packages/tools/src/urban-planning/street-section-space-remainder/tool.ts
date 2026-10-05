import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rightOfWayWidth: number;
  readonly carriagewayWidth: number;
  readonly sidewalkTotalWidth: number;
};
export type Output = { readonly remainingWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rightOfWayWidth: { type: "number", minimum: 0 },
    carriagewayWidth: { type: "number", minimum: 0 },
    sidewalkTotalWidth: { type: "number", minimum: 0 },
  },
  required: ["rightOfWayWidth", "carriagewayWidth", "sidewalkTotalWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingWidth: { type: "number" } },
  required: ["remainingWidth"],
} as const;
/** Balance a street section's explicit carriageway and total sidewalk allocation against its right-of-way width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rightOfWayWidth, carriagewayWidth, sidewalkTotalWidth } = request;
  const compute = (): Output => {
    H.domain(
      rightOfWayWidth >= 0 && carriagewayWidth >= 0 && sidewalkTotalWidth >= 0,
      "rightOfWayWidth",
    );
    return {
      remainingWidth: rightOfWayWidth - carriagewayWidth - sidewalkTotalWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rightOfWayWidth: 20, carriagewayWidth: 10, sidewalkTotalWidth: 6 },
  output: { remainingWidth: 4 },
} satisfies ToolExample<Input, Output>;
export const streetSectionSpaceRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/street-section-space-remainder",
    title: "Street Section Space Remainder Tool",
    description:
      "Balance a street section's explicit carriageway and total sidewalk allocation against its right-of-way width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rightOfWayWidth: { type: "number", minimum: 0 },
        carriagewayWidth: { type: "number", minimum: 0 },
        sidewalkTotalWidth: { type: "number", minimum: 0 },
      },
      required: ["rightOfWayWidth", "carriagewayWidth", "sidewalkTotalWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingWidth: { type: "number" } },
      required: ["remainingWidth"],
    },
    ports: {
      inputs: [
        {
          id: "rightOfWayWidth",
          label: "Right Of Way Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carriagewayWidth",
          label: "Carriageway Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sidewalkTotalWidth",
          label: "Sidewalk Total Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingWidth",
          label: "Remaining Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = streetSectionSpaceRemainderTool.execute;
export default streetSectionSpaceRemainderTool;
