import configparser
import os.path

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

config_path = os.path.join(BASE_DIR, "config.ini")

config = configparser.ConfigParser()
config.read(config_path)
