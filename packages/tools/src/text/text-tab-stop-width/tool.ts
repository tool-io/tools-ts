import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentColumn: number;
  readonly tabSize: number;
};
export type Output = {
  readonly spacesToNextStop: number;
  readonly nextColumn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentColumn: { type: "integer", minimum: 0 },
    tabSize: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["currentColumn", "tabSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spacesToNextStop: { type: "integer" },
    nextColumn: { type: "integer" },
  },
  required: ["spacesToNextStop", "nextColumn"],
} as const;
/** Advance a zero-based text column to the next uniform tab stop; a tab on a stop advances a full tab width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentColumn, tabSize } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(currentColumn) &&
        currentColumn >= 0 &&
        currentColumn <= Number.MAX_SAFE_INTEGER,
      "currentColumn",
    ),
      currentColumn);
    (H.domain(
      Number.isSafeInteger(tabSize) && tabSize >= 1 && tabSize <= 256,
      "tabSize",
    ),
      tabSize);
    return {
      spacesToNextStop: tabSize - (currentColumn % tabSize),
      nextColumn: currentColumn + tabSize - (currentColumn % tabSize),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentColumn: 6, tabSize: 4 },
  output: { spacesToNextStop: 2, nextColumn: 8 },
} satisfies ToolExample<Input, Output>;
export const textTabStopWidthTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "text/text-tab-stop-width",
    title: "Text Tab Stop Width Tool",
    description:
      "Advance a zero-based text column to the next uniform tab stop; a tab on a stop advances a full tab width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentColumn: { type: "integer", minimum: 0 },
        tabSize: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["currentColumn", "tabSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spacesToNextStop: { type: "integer" },
        nextColumn: { type: "integer" },
      },
      required: ["spacesToNextStop", "nextColumn"],
    },
    ports: {
      inputs: [
        {
          id: "currentColumn",
          label: "Current Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tabSize",
          label: "Tab Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "spacesToNextStop",
          label: "Spaces To Next Stop",
          valueType: { type: "integer" },
        },
        {
          id: "nextColumn",
          label: "Next Column",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = textTabStopWidthTool.execute;
export default textTabStopWidthTool;
