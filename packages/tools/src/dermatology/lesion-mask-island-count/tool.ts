import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mask: readonly (readonly number[])[];
  readonly eightConnected: boolean;
};
export type Output = {
  readonly islands: number;
  readonly foregroundPixels: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mask: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
    eightConnected: { type: "boolean" },
  },
  required: ["mask", "eightConnected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    islands: { type: "integer" },
    foregroundPixels: { type: "integer" },
  },
  required: ["islands", "foregroundPixels"],
} as const;
/** Count connected components in an explicitly supplied binary research mask using declared four- or eight-neighbor connectivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mask, eightConnected } = request;
  const compute = (): Output => {
    H.domain(
      mask.every(
        (r) =>
          r.length === (mask[0]?.length ?? 0) &&
          r.every((x) => x === 0 || x === 1),
      ),
      "mask",
    );
    const seen = new Set<string>();
    let islands = 0,
      foregroundPixels = 0;
    for (let r = 0; r < mask.length; r++)
      for (let c = 0; c < mask[r].length; c++)
        if (mask[r][c] === 1) {
          foregroundPixels++;
          const key = r + "," + c;
          if (seen.has(key)) continue;
          islands++;
          seen.add(key);
          const stack: [[number, number], ...[number, number][]] = [[r, c]];
          while (stack.length) {
            const cell = stack.pop();
            if (!cell) break;
            for (let dr = -1; dr <= 1; dr++)
              for (let dc = -1; dc <= 1; dc++) {
                if (
                  (dr === 0 && dc === 0) ||
                  (!eightConnected && Math.abs(dr) + Math.abs(dc) !== 1)
                )
                  continue;
                const nr = cell[0] + dr,
                  nc = cell[1] + dc,
                  k = nr + "," + nc;
                if (
                  nr >= 0 &&
                  nr < mask.length &&
                  nc >= 0 &&
                  nc < mask[nr].length &&
                  mask[nr][nc] === 1 &&
                  !seen.has(k)
                ) {
                  seen.add(k);
                  stack.push([nr, nc]);
                }
              }
          }
        }
    return { islands, foregroundPixels };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mask: [
      [1, 0],
      [0, 1],
    ],
    eightConnected: false,
  },
  output: { islands: 2, foregroundPixels: 2 },
} satisfies ToolExample<Input, Output>;
export const lesionMaskIslandCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/lesion-mask-island-count",
    title: "Lesion Mask Island Count Tool",
    description:
      "Count connected components in an explicitly supplied binary research mask using declared four- or eight-neighbor connectivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mask: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
        eightConnected: { type: "boolean" },
      },
      required: ["mask", "eightConnected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        islands: { type: "integer" },
        foregroundPixels: { type: "integer" },
      },
      required: ["islands", "foregroundPixels"],
    },
    ports: {
      inputs: [
        {
          id: "mask",
          label: "Mask",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
        {
          id: "eightConnected",
          label: "Eight Connected",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "islands", label: "Islands", valueType: { type: "integer" } },
        {
          id: "foregroundPixels",
          label: "Foreground Pixels",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = lesionMaskIslandCountTool.execute;
export default lesionMaskIslandCountTool;
