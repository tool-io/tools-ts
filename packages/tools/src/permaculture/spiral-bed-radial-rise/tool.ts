import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radialRun: number;
  readonly suppliedRisePerRun: number;
};
export type Output = { readonly signedRise: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radialRun: { type: "number", minimum: 0 },
    suppliedRisePerRun: { type: "number" },
  },
  required: ["radialRun", "suppliedRisePerRun"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedRise: { type: "number" } },
  required: ["signedRise"],
} as const;
/** Apply an explicit rise-per-run ratio to radial run without modeling a spiral curve or selecting a design. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radialRun, suppliedRisePerRun } = request;
  const compute = (): Output => {
    H.domain(radialRun >= 0, "radialRun");
    return { signedRise: radialRun * suppliedRisePerRun };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radialRun: 2, suppliedRisePerRun: 0.25 },
  output: { signedRise: 0.5 },
} satisfies ToolExample<Input, Output>;
export const spiralBedRadialRiseTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["permaculture", "agriculture"],
        keywords: ["permaculture", "agriculture"],
      },
      id: "permaculture/spiral-bed-radial-rise",
      title: "Spiral BED Radial Rise",
      description:
        "Apply an explicit rise-per-run ratio to radial run without modeling a spiral curve or selecting a design.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radialRun: { type: "number", minimum: 0 },
          suppliedRisePerRun: { type: "number" },
        },
        required: ["radialRun", "suppliedRisePerRun"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedRise: { type: "number" } },
        required: ["signedRise"],
      },
      ports: {
        inputs: [
          {
            id: "radialRun",
            label: "Radial Run",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedRisePerRun",
            label: "Supplied Rise Per Run",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedRise",
            label: "Signed Rise",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = spiralBedRadialRiseTool.execute;
export default spiralBedRadialRiseTool;
