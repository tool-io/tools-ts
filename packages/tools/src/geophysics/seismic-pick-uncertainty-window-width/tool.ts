import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestPick: number;
  readonly latestPick: number;
};
export type Output = {
  readonly windowWidth: number;
  readonly midpoint: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestPick: { type: "number" },
    latestPick: { type: "number" },
  },
  required: ["earliestPick", "latestPick"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { windowWidth: { type: "number" }, midpoint: { type: "number" } },
  required: ["windowWidth", "midpoint"],
} as const;
/** Report width and midpoint of an explicit seismic pick-time uncertainty bracket without assigning a confidence distribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestPick, latestPick } = request;
  const compute = (): Output => {
    H.domain(latestPick >= earliestPick, "latestPick");
    return {
      windowWidth: latestPick - earliestPick,
      midpoint: earliestPick / 2 + latestPick / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestPick: 10, latestPick: 14 },
  output: { windowWidth: 4, midpoint: 12 },
} satisfies ToolExample<Input, Output>;
export const seismicPickUncertaintyWindowWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/seismic-pick-uncertainty-window-width",
    title: "Seismic Pick Uncertainty Window Width Tool",
    description:
      "Report width and midpoint of an explicit seismic pick-time uncertainty bracket without assigning a confidence distribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestPick: { type: "number" },
        latestPick: { type: "number" },
      },
      required: ["earliestPick", "latestPick"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowWidth: { type: "number" },
        midpoint: { type: "number" },
      },
      required: ["windowWidth", "midpoint"],
    },
    ports: {
      inputs: [
        {
          id: "earliestPick",
          label: "Earliest Pick",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestPick",
          label: "Latest Pick",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "windowWidth",
          label: "Window Width",
          valueType: { type: "number" },
        },
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seismicPickUncertaintyWindowWidthTool.execute;
export default seismicPickUncertaintyWindowWidthTool;
