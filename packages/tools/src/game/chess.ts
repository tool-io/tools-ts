import { simpleError } from "../core/simple.js";
import { bounded } from "../ergonomics/shared.js";
export type Position = {
  board: string[];
  turn: string;
  rights: string;
  ep: number;
  halfmove: number;
  fullmove: number;
};
export const pieceSide = (piece: string): string =>
  piece === "." ? "" : piece === piece.toUpperCase() ? "w" : "b";
export const square = (name: string): number =>
  /^[a-h][1-8]$(?![\s\S])/.test(name)
    ? name.charCodeAt(0) - 97 + 8 * (Number(name[1]) - 1)
    : simpleError("square", "Exact algebraic square a1–h8 required.");
export const attacked = (
  board: readonly string[],
  target: number,
  by: string,
): boolean => {
  const tx = target % 8,
    ty = Math.floor(target / 8);
  for (let i = 0; i < 64; i++) {
    const p = board[i];
    if (pieceSide(p) !== by) continue;
    const x = i % 8,
      y = Math.floor(i / 8),
      dx = tx - x,
      dy = ty - y,
      k = p.toLowerCase();
    if (
      (k === "p" && Math.abs(dx) === 1 && dy === (by === "w" ? 1 : -1)) ||
      (k === "n" && Math.abs(dx) * Math.abs(dy) === 2) ||
      (k === "k" && Math.max(Math.abs(dx), Math.abs(dy)) === 1)
    )
      return true;
    if (
      ((k === "b" || k === "q") && Math.abs(dx) === Math.abs(dy) && dx !== 0) ||
      ((k === "r" || k === "q") &&
        (dx === 0 || dy === 0) &&
        (dx !== 0 || dy !== 0))
    ) {
      const sx = Math.sign(dx),
        sy = Math.sign(dy);
      let a = x + sx,
        b = y + sy,
        clear = true;
      while (a !== tx || b !== ty) {
        if (board[a + 8 * b] !== ".") {
          clear = false;
          break;
        }
        a += sx;
        b += sy;
      }
      if (clear) return true;
    }
  }
  return false;
};
export const fen = (text: string): Position => {
  if (text.length > 200)
    return simpleError(
      "fen",
      "Bounded complete six-field standard FEN required.",
    );
  const fields = text.split(" ");
  if (
    fields.length !== 6 ||
    !["w", "b"].includes(fields[1]) ||
    !/^(?:-|K?Q?k?q?)$(?![\s\S])/.test(fields[2]) ||
    fields[2] === "" ||
    !/^(0|[1-9][0-9]{0,6})$(?![\s\S])/.test(fields[4]) ||
    !/^[1-9][0-9]{0,6}$(?![\s\S])/.test(fields[5])
  )
    return simpleError("fen", "Canonical complete FEN fields required.");
  const rows = fields[0].split("/"),
    board = Array<string>(64).fill(".");
  if (rows.length !== 8)
    return simpleError("fen", "Eight board ranks required.");
  for (let r = 0; r < 8; r++) {
    if (/[1-8]{2}/.test(rows[r]))
      return simpleError(
        "fen",
        "Consecutive empty-run digits are not canonical FEN.",
      );
    let x = 0;
    for (const p of rows[r]) {
      if (/[1-8]/.test(p)) x += Number(p);
      else if (/[PNBRQKpnbrqk]/.test(p) && x < 8) {
        board[x + 8 * (7 - r)] = p;
        x++;
      } else return simpleError("fen", "Valid bounded placement required.");
    }
    if (x !== 8)
      return simpleError("fen", "Each board rank must expand to eight files.");
  }
  for (const side of ["w", "b"]) {
    const pieces = board.filter((p) => pieceSide(p) === side);
    if (
      pieces.length > 16 ||
      pieces.filter((p) => p.toLowerCase() === "p").length > 8 ||
      pieces.filter((p) => p.toLowerCase() === "k").length !== 1
    )
      return simpleError(
        "fen",
        "Each side requires one king and at most original piece/pawn inventory.",
      );
  }
  if (board.some((p, i) => p.toLowerCase() === "p" && (i < 8 || i >= 56)))
    return simpleError("fen", "Pawns cannot occupy promotion/back ranks.");
  const turn = fields[1],
    other = turn === "w" ? "b" : "w",
    otherKing = board.indexOf(other === "w" ? "K" : "k");
  if (attacked(board, otherKing, turn))
    return simpleError(
      "fen",
      "Side that just moved cannot leave its own king attacked.",
    );
  const rights = fields[2] === "-" ? "" : fields[2];
  for (const c of rights) {
    const side = c === c.toUpperCase() ? "w" : "b",
      offset = side === "w" ? 0 : 56;
    if (
      board[offset + 4] !== (side === "w" ? "K" : "k") ||
      board[offset + (c.toLowerCase() === "k" ? 7 : 0)] !==
        (side === "w" ? "R" : "r")
    )
      return simpleError(
        "fen",
        "Castling right requires original king and rook on their home squares.",
      );
  }
  const ep = fields[3] === "-" ? -1 : square(fields[3]),
    halfmove = Number(fields[4]),
    fullmove = Number(fields[5]);
  if (ep >= 0) {
    const y = Math.floor(ep / 8),
      dir = turn === "w" ? 1 : -1;
    if (
      y !== (turn === "w" ? 5 : 2) ||
      board[ep] !== "." ||
      board[ep - 8 * dir] !== (other === "w" ? "P" : "p") ||
      board[ep + 8 * dir] !== "." ||
      halfmove !== 0
    )
      return simpleError(
        "fen",
        "Plausible immediately preceding double-pawn move required for en-passant field.",
      );
  }
  return { board, turn, rights, ep, halfmove, fullmove };
};
export const epLegal = (p: Position, from: number, to: number): boolean => {
  const dir = p.turn === "w" ? 1 : -1;
  if (
    to !== p.ep ||
    p.ep < 0 ||
    p.board[from] !== (p.turn === "w" ? "P" : "p") ||
    Math.floor(to / 8) - Math.floor(from / 8) !== dir ||
    Math.abs((to % 8) - (from % 8)) !== 1
  )
    return false;
  const next = [...p.board];
  next[to] = next[from];
  next[from] = ".";
  next[to - 8 * dir] = ".";
  return !attacked(
    next,
    next.indexOf(p.turn === "w" ? "K" : "k"),
    p.turn === "w" ? "b" : "w",
  );
};
export const castleLegal = (p: Position, side: string): boolean => {
  if (!["king", "queen"].includes(side))
    return simpleError("side", "king/queen castling side required.");
  const offset = p.turn === "w" ? 0 : 56,
    key = (side === "king" ? "k" : "q")[
      p.turn === "w" ? "toUpperCase" : "toLowerCase"
    ](),
    other = p.turn === "w" ? "b" : "w";
  if (!p.rights.includes(key) || attacked(p.board, offset + 4, other))
    return false;
  const empty = side === "king" ? [5, 6] : [1, 2, 3];
  if (empty.some((f) => p.board[offset + f] !== ".")) return false;
  for (const f of side === "king" ? [5, 6] : [3, 2]) {
    const next = [...p.board];
    next[offset + f] = next[offset + 4];
    next[offset + 4] = ".";
    if (attacked(next, offset + f, other)) return false;
  }
  return true;
};
export const repetitionKey = (p: Position): string => {
  const legalEp = p.ep >= 0 && p.board.some((_, i) => epLegal(p, i, p.ep));
  return (
    p.board.join("") +
    " " +
    p.turn +
    " " +
    (p.rights || "-") +
    " " +
    (legalEp ? p.ep : -1)
  );
};
export const materialDead = (p: Position): boolean => {
  const pieces = p.board.flatMap((v, i) =>
    v !== "." && v.toLowerCase() !== "k" ? [[v, i] as const] : [],
  );
  if (!pieces.length) return true;
  if (pieces.length === 1 && ["b", "n"].includes(pieces[0][0].toLowerCase()))
    return true;
  return (
    pieces.every(([v]) => v.toLowerCase() === "b") &&
    new Set(pieces.map(([, i]) => ((i % 8) + Math.floor(i / 8)) % 2)).size === 1
  );
};
export const knightDistance = (from: number, to: number): number => {
  bounded(from, "from", 0, 63);
  bounded(to, "to", 0, 63);
  const dist = Array<number>(64).fill(-1),
    queue = [from];
  dist[from] = 0;
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q];
    if (i === to) return dist[i];
    for (const [dx, dy] of [
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
    ]) {
      const x = (i % 8) + dx,
        y = Math.floor(i / 8) + dy,
        j = x + 8 * y;
      if (x >= 0 && x < 8 && y >= 0 && y < 8 && dist[j] === -1) {
        dist[j] = dist[i] + 1;
        queue.push(j);
      }
    }
  }
  return simpleError("square", "Unreachable board square.");
};
