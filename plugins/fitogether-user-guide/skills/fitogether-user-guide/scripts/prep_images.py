#!/usr/bin/env python3
"""이미지 사전 크롭 도구 — WeasyPrint object-fit 함정 회피용.

모든 사진을 HTML 박스의 가로:세로 비율과 '정확히 같은' 비율로 미리 잘라야
PDF에서 사진이 잘리거나 여백이 생기지 않는다. (SKILL.md의 'WeasyPrint 함정' 참고)

사용법:
  # 1) 받은 사진들을 한 장으로 모아 보기 (피사체 위치 파악용)
  python3 prep_images.py contact <사진폴더> contact.jpg

  # 2) 박스 비율에 맞춰 크롭 (피사체 중심 좌표를 보고 직접 지정)
  #    aspect = 박스 가로mm / 세로mm  (예: 56.7x48mm 박스 → 1.18)
  python3 prep_images.py crop 원본.jpg 출력.jpg --aspect 1.18 --center 540,660
  python3 prep_images.py crop 원본.jpg 출력.jpg --aspect 0.84 --box 40,130,653,860

  # 3) 피사체가 박스보다 길쭉할 때: 흰 배경 패딩으로 비율 맞춤 (흰 배경 사진 전용)
  python3 prep_images.py pad 원본.jpg 출력.jpg --aspect 0.98

  # 4) 180도 회전 (로고가 뒤집힌 사진)
  python3 prep_images.py rotate180 원본.jpg 출력.jpg

자주 쓰는 박스 비율 (example-guide.html 기준, A4 여백 16mm):
  표지 3분할(66mm 높이)        → 0.84
  STEP 3분할(64mm 높이, 세로형) → 0.886
  STEP 3분할(48mm 높이, 가로형) → 1.18
  STEP 2분할(58mm 폭, 48mm)    → 1.21
  특징 카드 썸네일(46x40mm)     → 1.15
"""
import argparse, sys, os
from PIL import Image, ImageDraw


def cmd_contact(args):
    files = sorted(f for f in os.listdir(args.src)
                   if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')))
    if not files:
        sys.exit("이미지가 없습니다: " + args.src)
    cols, cw, ch = 4, 380, 400
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * cw, rows * ch), 'white')
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        im = Image.open(os.path.join(args.src, f)).convert('RGB')
        im.thumbnail((cw - 20, ch - 40))
        x, y = (i % cols) * cw + 10, (i // cols) * ch + 10
        sheet.paste(im, (x, y))
        d.text((x, y + ch - 32), f, fill='black')
    sheet.save(args.out, quality=80)
    print(f"saved {args.out} ({len(files)} images)")


def cmd_crop(args):
    im = Image.open(args.src).convert('RGB')
    W, H = im.size
    if args.box:
        x0, y0, x1, y1 = map(int, args.box.split(','))
    else:
        cx, cy = (map(int, args.center.split(','))) if args.center else (W // 2, H // 2)
        # 비율을 유지하며 이미지 안에서 가능한 가장 큰 크롭 영역 계산
        w = min(W, int(H * args.aspect))
        h = int(w / args.aspect)
        x0 = max(0, min(W - w, cx - w // 2)); y0 = max(0, min(H - h, cy - h // 2))
        x1, y1 = x0 + w, y0 + h
    out = im.crop((x0, y0, x1, y1))
    got = out.size[0] / out.size[1]
    if abs(got - args.aspect) > 0.02:
        print(f"경고: 결과 비율 {got:.2f} ≠ 목표 {args.aspect} — box를 조정하세요", file=sys.stderr)
    out.save(args.out, quality=88)
    print(f"saved {args.out} {out.size} aspect={got:.2f}")


def cmd_pad(args):
    im = Image.open(args.src).convert('RGB')
    W, H = im.size
    if W / H < args.aspect:   # 너무 길쭉 → 좌우 패딩
        nw, nh = int(H * args.aspect), H
    else:                     # 너무 납작 → 상하 패딩
        nw, nh = W, int(W / args.aspect)
    canvas = Image.new('RGB', (nw, nh), args.color)
    canvas.paste(im, ((nw - W) // 2, (nh - H) // 2))
    canvas.save(args.out, quality=88)
    print(f"saved {args.out} {canvas.size}")


def cmd_rotate180(args):
    Image.open(args.src).rotate(180).save(args.out, quality=88)
    print(f"saved {args.out} (rotated 180)")


p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sub = p.add_subparsers(dest='cmd', required=True)

c = sub.add_parser('contact'); c.add_argument('src'); c.add_argument('out'); c.set_defaults(fn=cmd_contact)
c = sub.add_parser('crop'); c.add_argument('src'); c.add_argument('out')
c.add_argument('--aspect', type=float, required=True, help='박스 가로/세로 비율')
c.add_argument('--center', help='피사체 중심 px 좌표 "x,y" (기본: 이미지 중앙)')
c.add_argument('--box', help='크롭 영역 직접 지정 "x0,y0,x1,y1" (aspect 검증만 수행)')
c.set_defaults(fn=cmd_crop)
c = sub.add_parser('pad'); c.add_argument('src'); c.add_argument('out')
c.add_argument('--aspect', type=float, required=True); c.add_argument('--color', default='white')
c.set_defaults(fn=cmd_pad)
c = sub.add_parser('rotate180'); c.add_argument('src'); c.add_argument('out'); c.set_defaults(fn=cmd_rotate180)

a = p.parse_args()
a.fn(a)
