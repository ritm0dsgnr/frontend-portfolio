# Cyrillic drawn from Syne's own stems, bars, bowls. No other face.

from pathlib import Path

from fontTools.misc.transform import Transform
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from pathops import Path as SkiaPath
from pathops import PathPen, union

HERE = Path(__file__).resolve().parent
SYNE = HERE / "Syne-latin.woff2"


def draw_outlines(glyph, dest, glyf):
    if glyph.isComposite():
        for c in glyph.components:
            xx, xy, yx, yy = 1, 0, 0, 1
            if getattr(c, "transform", None):
                xx, xy, yx, yy = c.transform[0], c.transform[1], c.transform[2], c.transform[3]
            tp = TransformPen(dest, Transform(xx, xy, yx, yy, c.x, c.y))
            draw_outlines(glyf[c.glyphName], tp, glyf)
    else:
        glyph.draw(dest, glyf)


def replay(font, pieces):
    rec = RecordingPen()
    glyf = font["glyf"]
    for name, tr in pieces:
        dest = TransformPen(rec, tr) if tr is not None else rec
        draw_outlines(glyf[name], dest, glyf)
    pen = TTGlyphPen({})
    rec.replay(pen)
    return pen.glyph()


def rect(x0, y0, x1, y1, reverse=False):
    pen = TTGlyphPen(None)
    pts = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
    if reverse:
        pts = list(reversed(pts))
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()
    return pen.glyph()


def quad(pts):
    pen = TTGlyphPen(None)
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()
    return pen.glyph()


def bowl_right(x0, y0, x1, y1, pad):
    """Closed D-bowl to the right of x0. Outer + opposite hole, no overlap with a stem."""
    return merge([
        rect(x0, y0, x1, y1),
        rect(x0 + pad, y0 + pad, x1 - pad, y1 - pad, reverse=True),
    ])


def bowl_left(x0, y0, x1, y1, pad):
    return merge([
        rect(x0, y0, x1, y1),
        rect(x0 + pad, y0 + pad, x1 - pad, y1 - pad, reverse=True),
    ])


def merge(glyphs):
    rec = RecordingPen()
    for g in glyphs:
        draw_outlines(g, rec, {})
    pen = TTGlyphPen({})
    rec.replay(pen)
    return pen.glyph()


class _XYPen:
    """pathops.Path.draw → fontTools pen (xy vs (x,y))."""

    def __init__(self, dest):
        self.d = dest

    def moveTo(self, x, y=None):
        self.d.moveTo((x, y) if y is not None else x)

    def lineTo(self, x, y=None):
        self.d.lineTo((x, y) if y is not None else x)

    def qCurveTo(self, *args):
        if args and isinstance(args[0], (tuple, list)):
            self.d.qCurveTo(*args)
            return
        it = iter(args)
        self.d.qCurveTo(*list(zip(it, it)))

    def curveTo(self, *args):
        if args and isinstance(args[0], (tuple, list)):
            self.d.curveTo(*args)
            return
        it = iter(args)
        self.d.curveTo(*list(zip(it, it)))

    def closePath(self):
        self.d.closePath()

    def endPath(self):
        pass


def union_glyph(glyph):
    """Склеить перекрывающиеся контуры в один (без шва на стыке)."""
    rec = RecordingPen()
    draw_outlines(glyph, rec, {})
    parts, cur = [], []
    for op, args in rec.value:
        cur.append((op, args))
        if op == "closePath":
            parts.append(cur)
            cur = []
    if len(parts) <= 1:
        return glyph
    paths = []
    for part in parts:
        p = SkiaPath()
        pen = PathPen(p)
        for op, args in part:
            getattr(pen, op)(*args)
        paths.append(p)
    out = SkiaPath()
    union(paths, PathPen(out), clockwise=True)
    pen = TTGlyphPen({})
    out.draw(_XYPen(pen))
    g = pen.glyph()
    bound(g)
    return g


def bound(g, glyf=None):
    try:
        g.recalcBounds(glyf or {})
    except Exception:
        pass
    return g


def metrics(g, extra=80):
    bound(g)
    if not getattr(g, "numberOfContours", 0):
        return extra, 0
    return int(g.xMax + extra * 0.25), int(g.xMin)


def put(font, name, glyph, uni, adv=None):
    try:
        glyph.recalcBounds(font["glyf"])
    except Exception:
        pass
    font["glyf"][name] = glyph
    if adv is None:
        adv, lsb = metrics(glyph)
    else:
        lsb = getattr(glyph, "xMin", 0) or 0
    font["hmtx"][name] = (int(adv), int(lsb))
    if name not in font.getGlyphOrder():
        font.setGlyphOrder(font.getGlyphOrder() + [name])
    for table in font["cmap"].tables:
        if table.isUnicode():
            table.cmap[uni] = name


def flip_x(font, name):
    g = font["glyf"][name]
    mid = (g.xMin + g.xMax) / 2
    return replay(font, [(name, Transform(-1, 0, 0, 1, 2 * mid, 0))])


def flip_y(font, name, cap):
    return replay(font, [(name, Transform(1, 0, 0, -1, 0, cap))])


def scale_to(font, name, y1):
    g = font["glyf"][name]
    h = max(g.yMax - g.yMin, 1)
    s = y1 / h
    return replay(font, [(name, Transform(s, 0, 0, s, 0, -g.yMin * s))])


def stems(font):
    i = font["glyf"]["I"]
    sw = i.xMax - i.xMin
    cap = i.yMax
    left = i.xMin
    o = font["glyf"]["o"]
    xh = o.yMax
    h = font["glyf"]["H"]
    bar = None
    start = 0
    for e in h.endPtsOfContours:
        pts = list(h.coordinates[start : e + 1])
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        if max(ys) - min(ys) < cap * 0.4:
            bar = (min(xs), min(ys), max(xs), max(ys))
        start = e + 1
    bh = (bar[3] - bar[1]) if bar else int(sw * 0.9)
    return {
        "sw": sw,
        "cap": cap,
        "xh": xh,
        "left": left,
        "bh": bh,
        "os": 10,
        "side": left,
    }


def add_cyrillic(font):
    m = stems(font)
    sw, cap, xh, side, bh = m["sw"], m["cap"], m["xh"], m["side"], m["bh"]
    hmtx = font["hmtx"]

    def I_at(x, y0=0, y1=None):
        y1 = cap if y1 is None else y1
        return rect(x, y0, x + sw, y1)

    copies = {
        0x0410: "A",
        0x0412: "B",
        0x0415: "E",
        0x041A: "K",
        0x041D: "H",
        0x041E: "O",
        0x0420: "P",
        0x0421: "C",
        0x0422: "T",
        0x0425: "X",
    }
    for uni, src in copies.items():
        put(font, f"cyr{uni:04X}", replay(font, [(src, None)]), uni, hmtx[src][0])

    put(font, "cyr0401", replay(font, [("Edieresis", None)]), 0x0401, hmtx["Edieresis"][0])

    # М чуть уже Syne M
    sx_m = 0.88
    put(
        font,
        "cyr041C",
        replay(font, [("M", Transform(sx_m, 0, 0, 1, 0, 0))]),
        0x041C,
        int(hmtx["M"][0] * sx_m),
    )

    # Г
    top_w = int(hmtx["E"][0] * 0.92)
    ge = merge([I_at(side), rect(side, cap - bh, side + top_w, cap)])
    put(font, "cyr0413", ge, 0x0413)

    # П
    gap = int(hmtx["H"][0] - 2 * side - 2 * sw)
    right = side + sw + max(gap, int(sw * 2.2))
    pe = merge([
        I_at(side),
        I_at(right),
        rect(side, cap - bh, right + sw, cap),
    ])
    put(font, "cyr041F", pe, 0x041F)

    # И = N flipped
    put(font, "cyr0418", flip_x(font, "N"), 0x0418, hmtx["N"][0])

    # Й = И + dieresis
    ig = font["glyf"]["cyr0418"]
    mid = (ig.xMin + ig.xMax) / 2
    dots = bound(replay(font, [("dieresis", None)]))
    dx = mid - (dots.xMin + dots.xMax) / 2
    iy = replay(font, [
        ("cyr0418", None),
        ("dieresis", Transform(1, 0, 0, 1, dx, 8)),
    ])
    put(font, "cyr0419", iy, 0x0419, hmtx["N"][0])

    # Л = A without the crossbar (outer triangle only)
    a = font["glyf"]["A"]
    pts = list(a.coordinates)
    ends = list(a.endPtsOfContours)
    start = 0
    outer = None
    for e in ends:
        chunk = pts[start : e + 1]
        if max(p[1] for p in chunk) > cap * 0.8:
            outer = chunk
        start = e + 1
    if outer:
        pen = TTGlyphPen({})
        pen.moveTo(outer[0])
        for p in outer[1:]:
            pen.lineTo(p)
        pen.closePath()
        put(font, "cyr041B", pen.glyph(), 0x041B, hmtx["A"][0])
    else:
        put(font, "cyr041B", replay(font, [("A", None)]), 0x041B, hmtx["A"][0])

    # Д — перевёрнутая U (круглая сверху) + полка
    ug = font["glyf"]["U"]
    foot = int(sw * 0.45)
    put(font, "cyr0414", merge([
        flip_y(font, "U", cap),
        rect(ug.xMin - foot, 0, ug.xMax + foot, bh),
    ]), 0x0414, int(ug.xMax + foot + side))

    # Ж = I + K-arms left and right
    k = font["glyf"]["K"]
    k_stem = None
    k_arms = None
    start = 0
    for e in k.endPtsOfContours:
        chunk = list(k.coordinates[start : e + 1])
        xs = [p[0] for p in chunk]
        if max(xs) - min(xs) < sw * 1.6:
            k_stem = (min(xs), max(xs))
        else:
            k_arms = chunk
        start = e + 1
    zhe_adv = int(hmtx["K"][0] + hmtx["I"][0] * 0.7)
    cx = zhe_adv // 2 - sw // 2
    pieces = [I_at(cx)]
    if k_arms:
        # shift arms so they grow from center stem
        k_origin = k_stem[1] if k_stem else k.xMin + sw
        shift = cx + sw - k_origin
        pen = TTGlyphPen(None)
        pen.moveTo((k_arms[0][0] + shift, k_arms[0][1]))
        for p in k_arms[1:]:
            pen.lineTo((p[0] + shift, p[1]))
        pen.closePath()
        pieces.append(pen.glyph())
        # mirror arms
        rec = RecordingPen()
        pen.glyph().draw(rec, None)
        # rebuild mirrored
        mx = cx + sw / 2
        pen2 = TTGlyphPen(None)
        first = True
        for p in k_arms:
            x = 2 * mx - (p[0] + shift)
            if first:
                pen2.moveTo((x, p[1]))
                first = False
            else:
                pen2.lineTo((x, p[1]))
        pen2.closePath()
        pieces.append(pen2.glyph())
    sx_zh = 0.88
    zhe = merge(pieces)
    bound(zhe)
    # сузить и сдвинуть к side, как у остальных
    dx = side - zhe.xMin * sx_zh
    rec = RecordingPen()
    tp = TransformPen(rec, Transform(sx_zh, 0, 0, 1, dx, 0))
    draw_outlines(zhe, tp, {})
    pen = TTGlyphPen({})
    rec.replay(pen)
    zhe_n = pen.glyph()
    bound(zhe_n)
    put(font, "cyr0416", zhe_n, 0x0416, int(zhe_n.xMax + side))

    # З = Syne three scaled to cap
    ze = scale_to(font, "three", cap)
    put(font, "cyr0417", ze, 0x0417)

    # У = Syne Y
    put(font, "cyr0423", replay(font, [("Y", None)]), 0x0423, hmtx["Y"][0])

    pad = max(int(sw * 0.38), 10)
    bowl_w = int(hmtx["P"][0] - side)
    tick_w = int(sw * 0.55)
    desc = int(sw * 0.85)
    mid = int(cap * 0.50)

    def stem(x, y0=0, y1=None, ssw=None):
        ssw = sw if ssw is None else ssw
        y1 = cap if y1 is None else y1
        return rect(x, y0, x + ssw, y1)

    # Ь Б Ъ Ы — чаша как у P, снизу
    p_adv = hmtx["P"][0]
    put(font, "cyr042C", flip_y(font, "P", cap), 0x042C, p_adv)

    put(font, "cyr0411", merge([
        replay(font, [("cyr042C", None)]),
        rect(side, cap - bh, side + top_w, cap),
    ]), 0x0411, p_adv)

    flag = int(sw * 0.85)
    put(font, "cyr042A", merge([
        replay(font, [("cyr042C", None)]),
        rect(side - flag, cap - bh, side + sw, cap),
    ]), 0x042A, p_adv)

    iy = font["glyf"]["P"].xMax + int(sw * 0.45)
    put(font, "cyr042B", merge([
        replay(font, [("cyr042C", None)]),
        I_at(iy),
    ]), 0x042B, iy + sw + side)

    # Ф — широкая O, палка сквозь; winding как у Syne (outer CW, hole CCW)
    o = font["glyf"]["O"]
    oh = max(o.yMax - o.yMin, 1)
    ow0 = max(o.xMax - o.xMin, 1)
    ext = max(int(sw * 0.36), 28)
    s_y = (cap - 2 * ext) / oh
    s_x = s_y * 1.42
    dx = side - o.xMin * s_x
    dy = ext - o.yMin * s_y
    ow = ow0 * s_x
    stem_x = side + ow / 2 - sw / 2
    tr = Transform(s_x, 0, 0, s_y, dx, dy)

    def one_contour(src, idx, transform):
        rec = RecordingPen()
        draw_outlines(src, rec, font["glyf"])
        parts, cur = [], []
        for op, args in rec.value:
            cur.append((op, args))
            if op == "closePath":
                parts.append(cur)
                cur = []
        out = RecordingPen()
        tp = TransformPen(out, transform)
        for op, args in parts[idx]:
            getattr(tp, op)(*args)
        pen = TTGlyphPen({})
        out.replay(pen)
        return pen.glyph()

    outer_g = one_contour(o, 0, tr)
    hole = one_contour(o, 1, tr)
    bound(hole)
    pad_h = max(int(sw * 0.08), 3)
    hw = max(hole.xMax - hole.xMin, 1)

    def hole_at(x0, x1):
        sxh = (x1 - x0) / hw
        rec = RecordingPen()
        tp = TransformPen(rec, Transform(sxh, 0, 0, 1, x0 - hole.xMin * sxh, 0))
        draw_outlines(hole, tp, {})
        pen = TTGlyphPen({})
        rec.replay(pen)
        return pen.glyph()

    put(font, "cyr0424", merge([
        outer_g,
        hole_at(hole.xMin, stem_x - pad_h),
        hole_at(stem_x + sw + pad_h, hole.xMax),
        rect(stem_x, 0, stem_x + sw, cap, reverse=True),
    ]), 0x0424, int(side + ow + side))

    # Ц — круглая U; только правый низ 90°; палка как у Щ
    ug = font["glyf"]["U"]
    tick_out = int(sw * 0.75)
    x_r = ug.xMax
    ybot = 0
    bar_top = 190
    pts = list(ug.coordinates)
    flags = list(ug.flags)
    mid_x = pts[9][0]
    # срезать правую нижнюю дугу → угол (x_r, 0), левое скругление оставить
    new_pts = [pts[0], pts[1], pts[2], (x_r, ybot), (mid_x, ybot)]
    new_flags = [flags[0], flags[1], flags[2], 1, 1]
    for i in range(10, len(pts)):
        x, y = pts[i]
        if y <= 5 and x > 200:
            new_pts.append((x, ybot))
        else:
            new_pts.append((x, y))
        new_flags.append(flags[i])

    def _on(i):
        return bool(new_flags[i] & 1)

    pen = TTGlyphPen(None)
    n = len(new_pts)
    start_i = next(j for j in range(n) if _on(j))
    pen.moveTo(new_pts[start_i])
    j = (start_i + 1) % n
    while True:
        if _on(j):
            pen.lineTo(new_pts[j])
            j = (j + 1) % n
            if j == start_i:
                break
            continue
        offs = []
        while j != start_i and not _on(j):
            offs.append(new_pts[j])
            j = (j + 1) % n
        end = new_pts[start_i] if j == start_i else new_pts[j]
        if len(offs) == 1:
            pen.qCurveTo(offs[0], end)
        else:
            pen.qCurveTo(*(offs + [end]))
        if j == start_i:
            break
        j = (j + 1) % n
    pen.closePath()
    body = pen.glyph()
    bound(body)
    # хвостик: верхний правый угол скруглён
    tx0, ty0 = x_r - 1, -desc
    tx1, ty1 = x_r + tick_out, bar_top
    rad = min(int(tick_out * 0.55), int((ty1 - ty0) * 0.35), tick_out - 2)
    tpen = TTGlyphPen(None)
    tpen.moveTo((tx0, ty1))
    tpen.lineTo((tx1 - rad, ty1))
    tpen.qCurveTo((tx1, ty1), (tx1, ty1 - rad))
    tpen.lineTo((tx1, ty0))
    tpen.lineTo((tx0, ty0))
    tpen.closePath()
    tse = union_glyph(merge([body, tpen.glyph()]))
    bound(tse)
    put(font, "cyr0426", tse, 0x0426, int(tse.xMax + side))

    # Ч — полная арка n + CW-палка; 180° → палка справа; union убирает шов
    ng = font["glyf"]["n"]
    nh = max(ng.yMax - ng.yMin, 1)
    s_n = (cap * 0.78) / nh
    sx_n = s_n * 1.65
    dx_n = side - ng.xMin * sx_n
    dy_n = -ng.yMin * s_n
    tr_n = Transform(sx_n, 0, 0, s_n, dx_n, dy_n)
    rec = RecordingPen()
    draw_outlines(ng, rec, font["glyf"])
    parts, cur = [], []
    for op, args in rec.value:
        cur.append((op, args))
        if op == "closePath":
            parts.append(cur)
            cur = []
    parts.sort(key=len, reverse=True)
    arch = RecordingPen()
    tp = TransformPen(arch, tr_n)
    for op, args in parts[0]:
        getattr(tp, op)(*args)
    pen = TTGlyphPen({})
    arch.replay(pen)
    arch_g = pen.glyph()
    bound(arch_g)
    stem_w = max(int(sw * sx_n), 6)
    che = merge([
        arch_g,
        rect(arch_g.xMin, 0, arch_g.xMin + stem_w, cap, reverse=True),
    ])
    bound(che)
    cx = (che.xMin + che.xMax) / 2
    cy = (che.yMin + che.yMax) / 2
    rec = RecordingPen()
    tp = TransformPen(rec, Transform(-1, 0, 0, -1, 2 * cx, 2 * cy))
    draw_outlines(che, tp, {})
    pen = TTGlyphPen({})
    rec.replay(pen)
    che = pen.glyph()
    bound(che)
    rec = RecordingPen()
    tp = TransformPen(rec, Transform(1, 0, 0, 1, side - che.xMin, -che.yMin))
    draw_outlines(che, tp, {})
    pen = TTGlyphPen({})
    rec.replay(pen)
    che = union_glyph(pen.glyph())
    bound(che)
    put(font, "cyr0427", che, 0x0427, int(che.xMax + side))

    # Э — зеркало C, язычок от спинки почти до края
    cg = font["glyf"]["C"]
    ch = max(cg.yMax - cg.yMin, 1)
    s_c = cap / ch
    mid_c = s_c * (cg.xMin + cg.xMax) / 2
    e_body = replay(font, [(
        "C",
        Transform(-s_c, 0, 0, s_c, 2 * mid_c, -cg.yMin * s_c),
    )])
    bound(e_body)
    ew = e_body.xMax - e_body.xMin
    ty = int((e_body.yMin + e_body.yMax) / 2 - bh / 2)
    put(font, "cyr042D", merge([
        e_body,
        rect(
            e_body.xMin + int(ew * 0.28),
            ty,
            e_body.xMax - int(ew * 0.10),
            ty + bh,
        ),
    ]), 0x042D, int(hmtx["C"][0] * s_c))

    o = font["glyf"]["O"]
    o_shift = side + sw + int(sw * 0.2) - o.xMin
    put(font, "cyr042E", merge([
        I_at(side),
        replay(font, [("O", Transform(1, 0, 0, 1, o_shift, 0))]),
    ]), 0x042E, o_shift + (o.xMax - o.xMin) + side)

    # Я — зеркало R из Syne
    put(font, "cyr042F", flip_x(font, "R"), 0x042F, hmtx["R"][0])

    step = sw + int(sw * 1.15)
    put(font, "cyr0428", merge([
        I_at(side), I_at(side + step), I_at(side + step * 2),
        rect(side, 0, side + step * 2 + sw, bh),
    ]), 0x0428)
    put(font, "cyr0429", merge([
        I_at(side), I_at(side + step), I_at(side + step * 2),
        rect(side, 0, side + step * 2 + sw, bh),
        rect(side + step * 2 + sw, -desc, side + step * 2 + sw + tick_w, bh),
    ]), 0x0429)

    # строчных нет — нижний регистр кириллицы смотрит на заглавные
    for uni in range(0x0430, 0x0450):
        up = uni - 0x20
        for table in font["cmap"].tables:
            if table.isUnicode() and up in table.cmap:
                table.cmap[uni] = table.cmap[up]
    for table in font["cmap"].tables:
        if table.isUnicode() and 0x0401 in table.cmap:
            table.cmap[0x0451] = table.cmap[0x0401]


def rename(font, family, subfam, weight):
    ps = family.replace(" ", "") + "-" + subfam.replace(" ", "")
    for rec in font["name"].names:
        if rec.nameID in (1, 16):
            rec.string = family
        elif rec.nameID == 2:
            rec.string = subfam
        elif rec.nameID == 4:
            rec.string = f"{family} {subfam}"
        elif rec.nameID == 6:
            rec.string = ps
        elif rec.nameID == 3:
            rec.string = f"1.001;RITM;{ps}"
    font["OS/2"].usWeightClass = weight


def build(wght, subfam, weight):
    font = instancer.instantiateVariableFont(TTFont(SYNE), {"wght": wght}, inplace=False)
    add_cyrillic(font)
    for tag in ("gvar", "HVAR", "avar", "fvar", "STAT"):
        if tag in font:
            del font[tag]
    rename(font, "Ritm", subfam, weight)
    font.flavor = "woff2"
    out = HERE / f"Ritm-{subfam.replace(' ', '')}.woff2"
    font.save(out)
    cmap = font.getBestCmap()
    missing = [chr(u) for u in range(0x0410, 0x0450) if u not in cmap]
    yo = 0x0401 in cmap and 0x0451 in cmap
    print("wrote", out.name, "missing", "".join(missing), "yo", yo)


if __name__ == "__main__":
    build(400, "Regular", 400)
    build(800, "ExtraBold", 800)
