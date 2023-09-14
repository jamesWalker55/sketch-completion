import threading

import torch
from controlnet_aux.processor import HEDdetector
from diffusers import (
    ControlNetModel,
    DPMSolverMultistepScheduler,
    StableDiffusionControlNetPipeline,
)
from PIL import Image

from .config import config

device = torch.device("cuda")


controlnet = ControlNetModel.from_pretrained(
    config["server"]["controlnet"],
    torch_dtype=torch.float16,
).to(device)

pipe = StableDiffusionControlNetPipeline.from_single_file(
    config["server"]["stable_diffusion"],
    use_safetensors=config["server"]["stable_diffusion"]
    .lower()
    .endswith(".safetensors"),
    controlnet=controlnet,
    torch_dtype=torch.float16,
).to(device)
pipe.safety_checker = None
pipe.scheduler = DPMSolverMultistepScheduler.from_config(
    pipe.scheduler.config, use_karras_sigmas=True
)

hed_detector = HEDdetector.from_pretrained(config["server"]["hed"])


def execute(
    hint: Image.Image,
    pos_prompt: str,
    neg_prompt: str,
    steps: int = 20,
    controlnet_strength: float = 1.0,
) -> Image.Image:
    res = pipe(
        pos_prompt,
        hint.convert("RGB").point(lambda p: 256 if p > 128 else 0),
        negative_prompt=neg_prompt,
        num_inference_steps=steps,
        controlnet_conditioning_scale=controlnet_strength,
    )
    img = res.images[0]
    return img


def detect_hed(img: Image.Image):
    return hed_detector(img, scribble=False)


execute_lock = threading.Lock()


def execute_threadsafe(
    hint: Image.Image,
    pos_prompt: str,
    neg_prompt: str,
    steps: int = 20,
    controlnet_strength: float = 1.0,
):
    with execute_lock:
        return execute(
            hint,
            pos_prompt,
            neg_prompt,
            steps=steps,
            controlnet_strength=controlnet_strength,
        )


def detect_hed_threadsafe(img: Image.Image):
    with execute_lock:
        return detect_hed(img)
