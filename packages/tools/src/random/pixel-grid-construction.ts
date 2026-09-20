import { calculateFlipHorizontal } from "../matrix/flip-horizontal/tool.js";
import { calculateFlipVertical } from "../matrix/flip-vertical/tool.js";
import { calculateRotate90 } from "../matrix/rotate-90/tool.js";
export type PixelSymmetry =
  "none" | "left-right" | "top-bottom" | "both" | "quarter-turn";
export const pixelGridSchema = {
  type: "array",
  minItems: 2,
  maxItems: 32,
  items: {
    type: "array",
    minItems: 2,
    maxItems: 32,
    items: { type: "integer", minimum: 0, maximum: 7 },
  },
} as const;
/** Reuse matrix transforms on position IDs; one independent sampled slot per orbit. */
export const symmetrizePixelGrid = (
  source: readonly (readonly number[])[],
  symmetry: PixelSymmetry,
): number[][] => {
  const size = source.length,
    positions = Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => y * size + x),
    );
  const group: (readonly (readonly number[])[])[] = [positions];
  if (symmetry === "left-right" || symmetry === "both")
    group.push(calculateFlipHorizontal({ matrix: positions }).flipped);
  if (symmetry === "top-bottom" || symmetry === "both")
    group.push(calculateFlipVertical({ matrix: positions }).flipped);
  if (symmetry === "both")
    group.push(
      calculateFlipVertical({
        matrix: calculateFlipHorizontal({ matrix: positions }).flipped,
      }).flipped,
    );
  if (symmetry === "quarter-turn") {
    let rotated: readonly (readonly number[])[] = positions;
    for (let turn = 0; turn < 3; turn += 1) {
      rotated = calculateRotate90({ matrix: rotated }).rotated;
      group.push(rotated);
    }
  }
  return positions.map((row, y) =>
    row.map((_, x) => {
      const index = Math.min(...group.map((grid) => grid[y][x]));
      return source[Math.floor(index / size)][index % size];
    }),
  );
};
export const pixelGridSvg = (
  cells: readonly (readonly number[])[],
  colors: readonly string[],
): string =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
  cells[0].length +
  " " +
  cells.length +
  '" shape-rendering="crispEdges">' +
  cells
    .map((row, y) =>
      row
        .map((index, x) => {
          const color = colors[index];
          if (color === undefined)
            throw new Error("Pixel grid refers to an absent palette slot.");
          return (
            '<rect x="' +
            x +
            '" y="' +
            y +
            '" width="1" height="1" fill="' +
            color +
            '"/>'
          );
        })
        .join(""),
    )
    .join("") +
  "</svg>";
