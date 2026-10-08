import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly digitalCode: number;
  readonly suppliedRadianceGain: number;
  readonly suppliedRadianceOffset: number;
};
export type Output = { readonly radiance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digitalCode: { type: "integer", minimum: 0 },
    suppliedRadianceGain: { type: "number" },
    suppliedRadianceOffset: { type: "number" },
  },
  required: ["digitalCode", "suppliedRadianceGain", "suppliedRadianceOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radiance: { type: "number" } },
  required: ["radiance"],
} as const;
/** Apply explicit linear radiance gain and offset to a supplied nonnegative digital code without sensor lookup or calibration inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digitalCode, suppliedRadianceGain, suppliedRadianceOffset } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(digitalCode) &&
        digitalCode >= 0 &&
        digitalCode <= Number.MAX_SAFE_INTEGER,
      "digitalCode",
    ),
      digitalCode);
    return {
      radiance: digitalCode * suppliedRadianceGain + suppliedRadianceOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    digitalCode: 100,
    suppliedRadianceGain: 0.5,
    suppliedRadianceOffset: 2,
  },
  output: { radiance: 52 },
} satisfies ToolExample<Input, Output>;
export const earthObservationRadianceQuantizationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/earth-observation-radiance-quantization-term",
      title: "Earth Observation Radiance Quantization Term Tool",
      description:
        "Apply explicit linear radiance gain and offset to a supplied nonnegative digital code without sensor lookup or calibration inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          digitalCode: { type: "integer", minimum: 0 },
          suppliedRadianceGain: { type: "number" },
          suppliedRadianceOffset: { type: "number" },
        },
        required: [
          "digitalCode",
          "suppliedRadianceGain",
          "suppliedRadianceOffset",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { radiance: { type: "number" } },
        required: ["radiance"],
      },
      ports: {
        inputs: [
          {
            id: "digitalCode",
            label: "Digital Code",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedRadianceGain",
            label: "Supplied Radiance Gain",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedRadianceOffset",
            label: "Supplied Radiance Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "radiance", label: "Radiance", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = earthObservationRadianceQuantizationTermTool.execute;
export default earthObservationRadianceQuantizationTermTool;
