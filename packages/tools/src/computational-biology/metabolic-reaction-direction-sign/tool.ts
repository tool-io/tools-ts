import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rateMagnitude: number;
  readonly direction: string;
};
export type Output = { readonly signedRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rateMagnitude: { type: "number", minimum: 0 },
    direction: {
      type: "string",
      maxLength: 8192,
      enum: ["forward", "reverse", "zero"],
    },
  },
  required: ["rateMagnitude", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedRate: { type: "number" } },
  required: ["signedRate"],
} as const;
/** Apply an explicit forward-positive sign convention to a nonnegative recorded metabolic reaction-rate magnitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rateMagnitude, direction } = request;
  const compute = (): Output => {
    H.domain(rateMagnitude >= 0, "rateMagnitude");
    H.domain(["forward", "reverse", "zero"].includes(direction), "direction");
    H.domain(direction !== "zero" || rateMagnitude === 0, "direction");
    return {
      signedRate: direction === "reverse" ? -rateMagnitude : rateMagnitude,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rateMagnitude: 3, direction: "reverse" },
  output: { signedRate: -3 },
} satisfies ToolExample<Input, Output>;
export const metabolicReactionDirectionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/metabolic-reaction-direction-sign",
    title: "Metabolic Reaction Direction Sign",
    description:
      "Apply an explicit forward-positive sign convention to a nonnegative recorded metabolic reaction-rate magnitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rateMagnitude: { type: "number", minimum: 0 },
        direction: {
          type: "string",
          maxLength: 8192,
          enum: ["forward", "reverse", "zero"],
        },
      },
      required: ["rateMagnitude", "direction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedRate: { type: "number" } },
      required: ["signedRate"],
    },
    ports: {
      inputs: [
        {
          id: "rateMagnitude",
          label: "Rate Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedRate",
          label: "Signed Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = metabolicReactionDirectionSignTool.execute;
export default metabolicReactionDirectionSignTool;
