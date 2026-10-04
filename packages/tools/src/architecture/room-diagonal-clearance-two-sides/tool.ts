import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstClearSide: number;
  readonly secondClearSide: number;
};
export type Output = { readonly diagonal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstClearSide: { type: "number", minimum: 0 },
    secondClearSide: { type: "number", minimum: 0 },
  },
  required: ["firstClearSide", "secondClearSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diagonal: { type: "number" } },
  required: ["diagonal"],
} as const;
/** Return the diagonal clear span of a rectangular room from its two perpendicular clear sides. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstClearSide, secondClearSide } = request;
  const compute = (): Output => {
    H.domain(firstClearSide >= 0 && secondClearSide >= 0, "firstClearSide");
    return { diagonal: Math.hypot(firstClearSide, secondClearSide) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstClearSide: 3, secondClearSide: 4 },
  output: { diagonal: 5 },
} satisfies ToolExample<Input, Output>;
export const roomDiagonalClearanceTwoSidesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/room-diagonal-clearance-two-sides",
    title: "Room Diagonal Clearance Two Sides Tool",
    description:
      "Return the diagonal clear span of a rectangular room from its two perpendicular clear sides.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstClearSide: { type: "number", minimum: 0 },
        secondClearSide: { type: "number", minimum: 0 },
      },
      required: ["firstClearSide", "secondClearSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { diagonal: { type: "number" } },
      required: ["diagonal"],
    },
    ports: {
      inputs: [
        {
          id: "firstClearSide",
          label: "First Clear Side",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondClearSide",
          label: "Second Clear Side",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "diagonal", label: "Diagonal", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = roomDiagonalClearanceTwoSidesTool.execute;
export default roomDiagonalClearanceTwoSidesTool;
