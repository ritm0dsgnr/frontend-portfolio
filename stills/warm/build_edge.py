"""Torn-paper hero mask: deep bites, chipped corners, translucent fibre fringe.

Every side's outermost point sits exactly on the viewBox edge, so the painting
lines up with the page container on the left and right.

    python build_edge.py [seed]
"""

import math
import random
import sys
from pathlib import Path

W, H = 2000, 1000
STEP = 4
SEED = int(sys.argv[1]) if len(sys.argv) > 1 else 7
rng = random.Random(SEED)


def perimeter():
    """Points along a rounded rectangle with inward normals and side index."""
    radii = [rng.uniform(28, 70) for _ in range(4)]
    pts = []

    def line(x0, y0, x1, y1, nx, ny, side):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / STEP))
        for i in range(n):
            t = i / n
            pts.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, nx, ny, side))

    def arc(cx, cy, r, a0, side_from, side_to):
        n = max(4, int(r * math.pi / 2 / STEP))
        for i in range(n):
            a = a0 + (math.pi / 2) * i / n
            ox, oy = math.cos(a), math.sin(a)
            pts.append((cx + ox * r, cy + oy * r, -ox, -oy, (side_from, side_to, i / n)))

    tl, tr, br, bl = radii
    line(tl, 0, W - tr, 0, 0, 1, 0)
    arc(W - tr, tr, tr, -math.pi / 2, 0, 1)
    line(W, tr, W, H - br, -1, 0, 1)
    arc(W - br, H - br, br, 0, 1, 2)
    line(W - br, H, bl, H, 0, -1, 2)
    arc(bl, H - bl, bl, math.pi / 2, 2, 3)
    line(0, H - bl, 0, tl, 1, 0, 3)
    arc(tl, tl, tl, math.pi, 3, 0)
    return pts


def smooth_noise(count, octaves):
    """Periodic sum of sines so the contour closes without a seam."""
    waves = [
        (freq, rng.uniform(0, math.tau), amp * rng.uniform(0.7, 1.3))
        for freq_range, amp in octaves
        for freq in rng.sample(range(*freq_range), 3)
    ]
    return [
        sum(a * math.sin(f * math.tau * i / count + p) for f, p, a in waves)
        for i in range(count)
    ]


def bites(count, number, depth, width):
    out = [0.0] * count
    for _ in range(number):
        c = rng.randrange(count)
        d = rng.uniform(*depth)
        w = rng.uniform(*width) / STEP
        for k in range(-int(w * 3), int(w * 3) + 1):
            j = (c + k) % count
            jag = 1 + 0.35 * math.sin(k * 1.7) * math.sin(k * 0.6)
            out[j] += d * math.exp(-(k / w) ** 2) * jag
    return out


pts = perimeter()
n = len(pts)

shape = smooth_noise(n, [((2, 7), 16), ((9, 24), 7), ((40, 90), 2.6)])
torn = bites(n, 9, (18, 46), (14, 60))
grain = [rng.uniform(-1.6, 1.6) for _ in range(n)]
body = [s + t + g for s, t, g in zip(shape, torn, grain)]

fibre = [0.0] * n
for _ in range(220):
    c = rng.randrange(n)
    length = rng.uniform(3, 14)
    span = rng.randint(1, 3)
    for k in range(-span, span + 1):
        fibre[(c + k) % n] = max(fibre[(c + k) % n], length * (1 - abs(k) / (span + 1)))
fringe = [b - 6 - f + rng.uniform(-1, 1) for b, f in zip(body, fibre)]

# Pin each straight side so its outermost fringe point touches the edge.
side_min = {}
for (x, y, nx, ny, side), f in zip(pts, fringe):
    if isinstance(side, int):
        side_min[side] = min(side_min.get(side, f), f)


def shift(side):
    if isinstance(side, int):
        return side_min[side]
    a, b, t = side
    return side_min[a] * (1 - t) + side_min[b] * t


def path(offsets):
    coords = []
    for (x, y, nx, ny, side), off in zip(pts, offsets):
        d = max(0.0, off - shift(side))
        px = min(W, max(0.0, x + nx * d))
        py = min(H, max(0.0, y + ny * d))
        coords.append(f"{px:.1f} {py:.1f}")
    return "M" + " L".join(coords) + "Z"


svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
    f'viewBox="0 0 {W} {H}" preserveAspectRatio="none">'
    f'<path fill="#fff" fill-opacity="0.38" d="{path(fringe)}"/>'
    f'<path fill="#fff" d="{path(body)}"/>'
    "</svg>\n"
)
out = Path(__file__).with_name("edge-torn.svg")
out.write_text(svg, encoding="utf-8")
print(out.name, len(svg), "bytes, seed", SEED)
