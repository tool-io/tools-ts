import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedSnowDepthChange: number;
  readonly suppliedSnowDensity: number;
  readonly suppliedWaterDensity: number;
};
export type Output = { readonly signedWaterEquivalentChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedSnowDepthChange: { type: "number" },
    suppliedSnowDensity: { type: "number", minimum: 0 },
    suppliedWaterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "signedSnowDepthChange",
    "suppliedSnowDensity",
    "suppliedWaterDensity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedWaterEquivalentChange: { type: "number" } },
  required: ["signedWaterEquivalentChange"],
} as const;
/** Convert an explicit signed snow-depth change to water-equivalent depth using supplied compatible snow and water densities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedSnowDepthChange, suppliedSnowDensity, suppliedWaterDensity } =
    request;
  const compute = (): Output => {
    H.domain(suppliedSnowDensity >= 0, "suppliedSnowDensity");
    (H.domain(
      Number.isFinite(suppliedWaterDensity) && suppliedWaterDensity > 0,
      "suppliedWaterDensity",
    ),
      suppliedWaterDensity);
    return {
      signedWaterEquivalentChange:
        signedSnowDepthChange * (suppliedSnowDensity / suppliedWaterDensity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signedSnowDepthChange: 0.2,
    suppliedSnowDensity: 100,
    suppliedWaterDensity: 1000,
  },
  output: { signedWaterEquivalentChange: 0.020000000000000004 },
} satisfies ToolExample<Input, Output>;
export const snowWaterEquivalentIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/snow-water-equivalent-increment",
    title: "Snow Water Equivalent Increment Tool",
    description:
      "Convert an explicit signed snow-depth change to water-equivalent depth using supplied compatible snow and water densities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedSnowDepthChange: { type: "number" },
        suppliedSnowDensity: { type: "number", minimum: 0 },
        suppliedWaterDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "signedSnowDepthChange",
        "suppliedSnowDensity",
        "suppliedWaterDensity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedWaterEquivalentChange: { type: "number" } },
      required: ["signedWaterEquivalentChange"],
    },
    ports: {
      inputs: [
        {
          id: "signedSnowDepthChange",
          label: "Signed Snow Depth Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSnowDensity",
          label: "Supplied Snow Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWaterDensity",
          label: "Supplied Water Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedWaterEquivalentChange",
          label: "Signed Water Equivalent Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = snowWaterEquivalentIncrementTool.execute;
export default snowWaterEquivalentIncrementTool;
