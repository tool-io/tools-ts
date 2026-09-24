import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly beads: readonly string[] };
export type Output = {
  readonly orbitSize: number;
  readonly stabilizerSize: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beads: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["beads"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orbitSize: { type: "integer" },
    stabilizerSize: { type: "integer" },
  },
  required: ["orbitSize", "stabilizerSize"],
} as const;
/** Count distinct cyclic rotations of an explicitly supplied nonempty necklace; reflections are distinct. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beads } = request;
  const compute = (): Output => {
    H.domain(beads.length > 0);
    let orbitSize = beads.length;
    for (let p = 1; p <= beads.length; p++)
      if (beads.length % p === 0 && beads.every((x, i) => x === beads[i % p])) {
        orbitSize = p;
        break;
      }
    return { orbitSize, stabilizerSize: beads.length / orbitSize };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beads: ["A", "B", "A", "B"] },
  output: { orbitSize: 2, stabilizerSize: 2 },
} satisfies ToolExample<Input, Output>;
export const necklaceOrbitSizeTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "combinatorics/necklace-orbit-size",
    title: "Necklace Orbit Size Tool",
    description:
      "Count distinct cyclic rotations of an explicitly supplied nonempty necklace; reflections are distinct.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beads: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["beads"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orbitSize: { type: "integer" },
        stabilizerSize: { type: "integer" },
      },
      required: ["orbitSize", "stabilizerSize"],
    },
    ports: {
      inputs: [
        {
          id: "beads",
          label: "Beads",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "orbitSize",
          label: "Orbit Size",
          valueType: { type: "integer" },
        },
        {
          id: "stabilizerSize",
          label: "Stabilizer Size",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = necklaceOrbitSizeTool.execute;
export default necklaceOrbitSizeTool;
