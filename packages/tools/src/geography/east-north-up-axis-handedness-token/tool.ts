import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly axisOrder: readonly string[] };
export type Output = {
  readonly rightHanded: boolean;
  readonly inversions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["axisOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rightHanded: { type: "boolean" },
    inversions: { type: "integer" },
  },
  required: ["rightHanded", "inversions"],
} as const;
/** Calculate east north up axis handedness token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { axisOrder } = input;
  const compute = (): Output => {
    const order = ["east", "north", "up"];
    H.domain(
      axisOrder.length === 3 &&
        new Set(axisOrder).size === 3 &&
        axisOrder.every((x) => order.includes(x)),
    );
    const p = axisOrder.map((x) => order.indexOf(x));
    let inversions = 0;
    for (let i = 0; i < 3; i++)
      for (let j = i + 1; j < 3; j++) if (p[i] > p[j]) inversions++;
    return { rightHanded: inversions % 2 === 0, inversions };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { axisOrder: ["east", "up", "north"] },
  output: { rightHanded: false, inversions: 1 },
} satisfies ToolExample<Input, Output>;
export const eastNorthUpAxisHandednessTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/east-north-up-axis-handedness-token",
    title: "East North Up Axis Handedness Token Tool",
    description:
      "Calculate east north up axis handedness token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["axisOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rightHanded: { type: "boolean" },
        inversions: { type: "integer" },
      },
      required: ["rightHanded", "inversions"],
    },
    ports: {
      inputs: [
        {
          id: "axisOrder",
          label: "Axis Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "rightHanded",
          label: "Right Handed",
          valueType: { type: "boolean" },
        },
        {
          id: "inversions",
          label: "Inversions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = eastNorthUpAxisHandednessTokenTool.execute;
export default eastNorthUpAxisHandednessTokenTool;
