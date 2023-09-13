from io import BytesIO

from django.http import HttpResponse
from PIL import Image


def image_to_bytes(img: Image.Image, *, format: str = None, **kwargs):
    if format is None:
        raise ValueError("'format' must be provided as a keyword argument")

    img_bytes = BytesIO()
    img.save(img_bytes, format=format, **kwargs)
    return img_bytes.getvalue()


def process(request):
    path = R"Untitled.png"
    img = Image.open(path)
    img_bytes = image_to_bytes(img, format="jpeg", quality=90)
    return HttpResponse(img_bytes, content_type="image/jpeg")
