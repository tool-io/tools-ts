import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinateText: string;
  readonly publicDisclosure: boolean;
  readonly suppliedMask: string;
};
export type Output = { readonly displayLocation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinateText: { type: "string", maxLength: 8192 },
    publicDisclosure: { type: "boolean" },
    suppliedMask: { type: "string", maxLength: 8192 },
  },
  required: ["coordinateText", "publicDisclosure", "suppliedMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayLocation: { type: "string", maxLength: 8192 } },
  required: ["displayLocation"],
} as const;
/** Choose explicit outcrop coordinate text or supplied mask under a disclosure flag without promising location anonymity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinateText, publicDisclosure, suppliedMask } = request;
  const compute = (): Output => {
    return {
      displayLocation: publicDisclosure ? coordinateText : suppliedMask,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coordinateText: "12.34, 56.78",
    publicDisclosure: false,
    suppliedMask: "location withheld",
  },
  output: { displayLocation: "location withheld" },
} satisfies ToolExample<Input, Output>;
export const geologicalSampleOutcropCoordinateMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/geological-sample-outcrop-coordinate-mask",
      title: "Geological Sample Outcrop Coordinate Mask Tool",
      description:
        "Choose explicit outcrop coordinate text or supplied mask under a disclosure flag without promising location anonymity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinateText: { type: "string", maxLength: 8192 },
          publicDisclosure: { type: "boolean" },
          suppliedMask: { type: "string", maxLength: 8192 },
        },
        required: ["coordinateText", "publicDisclosure", "suppliedMask"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { displayLocation: { type: "string", maxLength: 8192 } },
        required: ["displayLocation"],
      },
      ports: {
        inputs: [
          {
            id: "coordinateText",
            label: "Coordinate Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "publicDisclosure",
            label: "Public Disclosure",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "suppliedMask",
            label: "Supplied Mask",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "displayLocation",
            label: "Display Location",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geologicalSampleOutcropCoordinateMaskTool.execute;
export default geologicalSampleOutcropCoordinateMaskTool;
