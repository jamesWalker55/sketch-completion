import base64
import json
from io import BytesIO

from django.http import HttpRequest, HttpResponse
from PIL import Image


def image_to_bytes(img: Image.Image, *, format: str = None, **kwargs):
    if format is None:
        raise ValueError("'format' must be provided as a keyword argument")

    img_bytes = BytesIO()
    img.save(img_bytes, format=format, **kwargs)
    return img_bytes.getvalue()


def parse_image_uri(uri: str):
    if uri.startswith("data:image/png;base64,"):
        encoded = uri[len("data:image/png;base64,") :]
        formats = ("PNG",)
    elif uri.startswith("data:image/jpeg;base64,"):
        encoded = uri[len("data:image/jpeg;base64,") :]
        formats = ("JPEG",)
    else:
        raise ValueError(f"Invalid image URI: {uri[:30]}")

    decoded = base64.b64decode(encoded)
    with BytesIO(decoded) as f:
        img = Image.open(f, formats=formats)
        img.load()
    return img


def process(request: HttpRequest):
    if request.method != "POST":
        return HttpResponse(status=405)

    if request.headers["Content-Type"] != "application/json":
        return HttpResponse("Content-Type must be application/json", status=400)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError as e:
        return HttpResponse(f"Invalid JSON body. {e}", status=400)

    # body["image_uri"]
    # body["prompt"]
    # body["negative_prompt"]

    img = parse_image_uri(body["image_uri"])
    img = Image.alpha_composite(
        Image.new("RGBA", img.size, (255, 255, 255)),
        img,
    )
    img = img.convert("RGB")

    img_bytes = image_to_bytes(img, format="jpeg", quality=90)

    return HttpResponse(img_bytes, content_type="image/jpeg")
