import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly earned: number;
  readonly used: number;
  readonly expired: number;
  readonly carryCap: number;
};
export type Output = {
  readonly beforeCap: number;
  readonly carried: number;
  readonly forfeited: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    earned: { type: "number", minimum: 0 },
    used: { type: "number", minimum: 0 },
    expired: { type: "number", minimum: 0 },
    carryCap: { type: "number", minimum: 0 },
  },
  required: ["opening", "earned", "used", "expired", "carryCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeCap: { type: "number" },
    carried: { type: "number" },
    forfeited: { type: "number" },
  },
  required: ["beforeCap", "carried", "forfeited"],
} as const;
/** Calculate energy credit rollover expiry from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, earned, used, expired, carryCap } = request;
  const compute = (): Output => {
    H.domain(
      opening >= 0 &&
        earned >= 0 &&
        used >= 0 &&
        expired >= 0 &&
        carryCap >= 0 &&
        used + expired <= opening + earned,
    );
    return {
      beforeCap: opening + earned - used - expired,
      carried: Math.min(carryCap, opening + earned - used - expired),
      forfeited: Math.max(0, opening + earned - used - expired - carryCap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opening: 100, earned: 50, used: 40, expired: 10, carryCap: 80 },
  output: { beforeCap: 100, carried: 80, forfeited: 20 },
} satisfies ToolExample<Input, Output>;
export const energyCreditRolloverExpiryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/energy-credit-rollover-expiry",
    title: "Energy Credit Rollover Expiry Tool",
    description:
      "Calculate energy credit rollover expiry from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "number", minimum: 0 },
        earned: { type: "number", minimum: 0 },
        used: { type: "number", minimum: 0 },
        expired: { type: "number", minimum: 0 },
        carryCap: { type: "number", minimum: 0 },
      },
      required: ["opening", "earned", "used", "expired", "carryCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeCap: { type: "number" },
        carried: { type: "number" },
        forfeited: { type: "number" },
      },
      required: ["beforeCap", "carried", "forfeited"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earned",
          label: "Earned",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "used",
          label: "Used",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expired",
          label: "Expired",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carryCap",
          label: "Carry Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "beforeCap", label: "Before Cap", valueType: { type: "number" } },
        { id: "carried", label: "Carried", valueType: { type: "number" } },
        { id: "forfeited", label: "Forfeited", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = energyCreditRolloverExpiryTool.execute;
export default energyCreditRolloverExpiryTool;
