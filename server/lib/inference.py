import torch
from diffusers import (
    ControlNetModel,
    DPMSolverMultistepScheduler,
    StableDiffusionControlNetPipeline,
)
from PIL import Image

from .config import config

device = torch.device("cuda")

config["Server"]["StableDiffusion"]
config["Server"]["ControlNet"]


controlnet = ControlNetModel.from_pretrained(
    config["Server"]["ControlNet"],
    torch_dtype=torch.float16,
).to(device)

pipe = StableDiffusionControlNetPipeline.from_single_file(
    config["Server"]["StableDiffusion"],
    use_safetensors=config["Server"]["StableDiffusion"]
    .lower()
    .endswith(".safetensors"),
    controlnet=controlnet,
    torch_dtype=torch.float16,
).to(device)
pipe.safety_checker = None
pipe.scheduler = DPMSolverMultistepScheduler.from_config(
    pipe.scheduler.config, use_karras_sigmas=True
)


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
